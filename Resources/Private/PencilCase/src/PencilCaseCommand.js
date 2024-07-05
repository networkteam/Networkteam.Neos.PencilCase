import Command from "@ckeditor/ckeditor5-core/src/command";
import toMap from "@ckeditor/ckeditor5-utils/src/tomap";

export default class PencilCaseCommand extends Command {
  constructor(editor, attributeIdentifier) {
    super(editor);

    this.attributeIdentifier = attributeIdentifier;
  }

  refresh() {
    const { document, schema } = this.editor.model;

    // Check if selection is already has the editable
    this.value = document.selection.getAttribute(this.attributeIdentifier);

    // Check if command is allowed on current selection
    this.isEnabled = schema.checkAttributeInSelection(
      document.selection,
      this.attributeIdentifier
    );
  }

  execute(options = {}) {
    const model = this.editor.model;
    const document = model.document;
    const selection = document.selection;

    const value =
      options.forceValue === undefined ? !this.value : options.forceValue;
    const attributes = toMap(selection.getAttributes());

    model.change((writer) => {
      // If the selection is collapsed (without any selection) we need to find the full range of the element
      if (selection.isCollapsed) {
        // If the selection is collapsed and the attribute is not set, we do nothing
        if (!selection.getAttribute(this.attributeIdentifier)) {
          return;
        }

        const position = selection.getFirstPosition();
        // Find the full range of the element
        const isSameElement = (value) => {
          return (
            value.item.hasAttribute(this.attributeIdentifier) &&
            value.item.getAttribute(this.attributeIdentifier) === this.value
          );
        };

        const startPosition = position.getLastMatchingPosition(isSameElement, {
          direction: "backward",
        });
        const endPosition = position.getLastMatchingPosition(isSameElement);
        const range = writer.createRange(startPosition, endPosition);

        // Remove all PencilCase related attributes
        if (!value || this.value === value) {
          for (const [key, _] of attributes) {
            if (
              key.startsWith("PencilCaseAttribute") ||
              key.startsWith("PencilCaseEditableAttribute")
            ) {
              writer.removeAttribute(key, range);
              writer.removeSelectionAttribute(key);
            }
          }
        } else {
          // Update value
          writer.setAttribute(this.attributeIdentifier, value, range);
          writer.setSelectionAttribute(this.attributeIdentifier, value);
        }
      } else {
        const ranges = model.schema.getValidRanges(
          selection.getRanges(),
          this.attributeIdentifier
        );

        for (const range of ranges) {
          if (value) {
            // Apply the attribute to the selection
            writer.setAttribute(this.attributeIdentifier, value, range);
          } else {
            // Remove all PencilCase related attributes
            for (const [key, _] of attributes) {
              if (
                key.startsWith("PencilCaseAttribute") ||
                key.startsWith("PencilCaseEditableAttribute")
              ) {
                writer.removeAttribute(key, range);
                writer.removeSelectionAttribute(key);
              }
            }
          }
        }
      }
    });
  }
}
