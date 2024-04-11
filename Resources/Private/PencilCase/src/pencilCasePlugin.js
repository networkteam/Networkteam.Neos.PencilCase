import { Plugin } from "ckeditor5-exports";
import AttributeCommand from "@ckeditor/ckeditor5-basic-styles/src/attributecommand";

export default (identifier, optionConfig) =>
  class PencilCasePlugin extends Plugin {
    init() {
      const attributeIdentifier = "PencilCaseAttribute_" + identifier;
      this.editor.model.schema.extend("$text", {
        allowAttributes: attributeIdentifier,
      });

      this.editor.model.schema.setAttributeProperties(attributeIdentifier, {
        isFormatting: true,
      });

      const { class: classes, styles, ...rest} = optionConfig.attributes;
      const config = {
        // the name of the model must match the "allowAttribute" from above.
        model: attributeIdentifier,
        view: {
          name: optionConfig.tagName || "span",
          classes,
          styles,
          attributes: rest,
        },
      };

      this.editor.conversion.attributeToElement(config);

      this.editor.commands.add(
        "pencilCaseCommand:" + identifier,
        new AttributeCommand(this.editor, attributeIdentifier)
      );
    }
  };
