import Command from "@ckeditor/ckeditor5-core/src/command";

export default class PencilCaseAttributeCommand extends Command {
  constructor(editor, attributeKey, attributeIdentifier) {
    super(editor);

    this.attributeKey = attributeKey;
    this.attributeIdentifier = attributeIdentifier;
  }

  refresh() {
    const { document, schema } = this.editor.model;

    // Check if selection already has the editable attribute
    this.value = document.selection.getAttribute(this.attributeKey);

    // Check if command is allowed on current selection
    this.isEnabled = schema.checkAttributeInSelection(
      document.selection,
      this.attributeKey
    );
  }

  execute(value) {
    const model = this.editor.model;
    const document = model.document;
    const selection = document.selection;

    model.change((writer) => {
      // In this case it doesn't matter if the selection is collapsed or not, we always need to find the full range of the element
      const firstPosition = selection.getFirstPosition();
      const lastPosition = selection.getLastPosition();

      const isSameElement = (value) =>
        value.item.getAttribute(this.attributeIdentifier);

      const startPosition = firstPosition.getLastMatchingPosition(
        isSameElement,
        {
          direction: "backward",
        }
      );
      const endPosition = lastPosition.getLastMatchingPosition(isSameElement);
      const range = writer.createRange(startPosition, endPosition);

      if (value) {
        writer.setAttribute(this.attributeKey, value, range);
        writer.setSelectionAttribute(this.attributeKey, value);
      } else {
        writer.removeAttribute(this.attributeKey, range);
        writer.removeSelectionAttribute(this.attributeKey);
      }
    });
  }
}
