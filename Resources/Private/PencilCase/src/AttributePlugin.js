import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import PencilCaseAttributeCommand from "./PencilCaseAttributeCommand";

export default (identifier, tagName, attributeKey, attributeValue) =>
  class AttributePlugin extends Plugin {
    init() {
      const attributeIdentifier = `PencilCaseEditableAttribute_${identifier}_${attributeKey}`
      this.editor.model.schema.extend("$text", {
        allowAttributes: attributeIdentifier,
      });

      this.editor.conversion.for("downcast").attributeToElement({
        model: attributeIdentifier,
        view: (value, writer) =>
          writer.createAttributeElement(
            tagName,
            {
              [attributeKey]: value,
            },
          ),
      });

      this.editor.conversion.for("upcast").elementToAttribute({
        view: {
          name: tagName,
          attributes: {
            [attributeKey]: attributeValue,
          },
        },
        model: {
          key: attributeIdentifier,
          value: (viewElement) => viewElement.getAttribute(attributeKey),
        },
      });

      this.editor.commands.add(attributeIdentifier, new PencilCaseAttributeCommand(this.editor, attributeIdentifier));
    }
  };
