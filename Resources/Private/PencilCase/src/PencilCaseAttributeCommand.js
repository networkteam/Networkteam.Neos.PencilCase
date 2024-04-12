import Command from "@ckeditor/ckeditor5-core/src/command";

export default class PencilCaseAttributeCommand extends Command {
  constructor(editor, attributeKey) {
    super(editor);

    this.attributeKey = attributeKey;
  }

  refresh() {
    const { document, schema } = this.editor.model;

    // Check if selection is already highlighted.
    this.value = document.selection.getAttribute(this.attributeKey);

    // Check if command is allowed on current selection.
    this.isEnabled = schema.checkAttributeInSelection(
      document.selection,
      this.attributeKey
    );
  }

  execute(value) {
    const model = this.editor.model;
    const doc = model.document;
    const selection = doc.selection;
    const toggleMode = value === undefined;
    value = toggleMode ? !this.value : value;

    console.log("PencilCaseAttributeCommand.execute", value);

    model.change((writer) => {
      
      if (!selection.isCollapsed) {
        const ranges = model.schema.getValidRanges(
          selection.getRanges(),
          this.attributeKey
        );

        console.log(ranges)

        for (const range of ranges) {
          if (value) {
            writer.setAttribute(this.attributeKey, value, range);
          } else {
            writer.removeAttribute(this.attributeKey, range);
          }
        }
      }

      if (value) {
        return writer.setSelectionAttribute(this.attributeKey, true);
      }

      return writer.removeSelectionAttribute(this.attributeKey);
    });
  }
}
