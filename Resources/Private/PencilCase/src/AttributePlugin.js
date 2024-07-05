import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import PencilCaseAttributeCommand from "./PencilCaseAttributeCommand";

export default (identifier, tagName, key, value) =>
  class AttributePlugin extends Plugin {
    init() {
      const attributeIdentifier = `PencilCaseAttribute_${identifier}`;
      const attributeKey = `PencilCaseEditableAttribute_${identifier}_${key}`;
      this.editor.model.schema.extend("$text", {
        allowAttributes: attributeKey,
      });

      this.editor.conversion.for("downcast").attributeToElement({
        model: attributeKey,
        view: (value, writer) =>
          writer.createAttributeElement(tagName, {
            [key]: value,
          }),
      });

      this.editor.conversion.for("upcast").elementToAttribute({
        view: {
          name: tagName,
          attributes: {
            [key]: value,
          },
        },
        model: {
          key: attributeKey,
          value: (viewElement) => viewElement.getAttribute(key),
        },
      });

      this.editor.commands.add(
        attributeKey,
        new PencilCaseAttributeCommand(
          this.editor,
          attributeKey,
          attributeIdentifier
        )
      );
    }
  };
