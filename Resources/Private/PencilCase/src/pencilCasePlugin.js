import { Plugin } from "ckeditor5-exports";
import PencilCaseCommand from "./PencilCaseCommand";
import { getAttributes, getClasses, getStyles } from "./utils";

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

      const config = {
        // the name of the model must match the "allowAttribute" from above.
        model: attributeIdentifier,
        view: {
          name: optionConfig.tagName || "span",
          classes: getClasses(optionConfig.attributes),
          styles: getStyles(optionConfig.attributes),
          attributes: getAttributes(optionConfig.attributes),
        },
      };

      this.editor.conversion.attributeToElement(config);

      this.editor.commands.add(
        "pencilCaseCommand:" + identifier,
        new PencilCaseCommand(this.editor, attributeIdentifier)
      );
    }
  };
