import manifest from "@neos-project/neos-ui-extensibility";
import { $get } from "plow-js";
import PencilCasePlugin from "./pencilCasePlugin";
import AttributePlugin from "./AttributePlugin";
import PencilCaseButton from "./PencilCaseButton";
import { getAttributes, getClasses, getStyles } from "./utils";

manifest(
  "Networkteam.Neos.PencilCase:PencilCase",
  {},
  (globalRegistry, { frontendConfiguration }) => {
    const richtextToolbar = globalRegistry
      .get("ckEditor5")
      .get("richtextToolbar");
    const config = globalRegistry.get("ckEditor5").get("config");
    const pencilCase = frontendConfiguration["Networkteam.Neos.PencilCase"];

    // Add custom block styles to headings dropdown
    if (
      pencilCase?.headingOptions &&
      typeof pencilCase.headingOptions === "object"
    ) {
      config.set("configureHeadings", (cfg) => {
        const additionalOptions = Object.keys(pencilCase.headingOptions).map(
          (identifier) => {
            const optionConfig = pencilCase.headingOptions[identifier];

            return {
              model: identifier,
              view: {
                name: optionConfig.tagName,
                classes: getClasses(optionConfig.attributes),
                styles: getStyles(optionConfig.attributes),
                attributes: getAttributes(optionConfig.attributes),
              },
              title: optionConfig.label,
              class: "ck-heading_heading_" + identifier,

              // It needs to be converted before the standard 'heading2'.
              converterPriority: "high",
            };
          }
        );

        const newOptions = [
          { model: "paragraph" },
          { model: "heading1", view: "h1" },
          { model: "heading2", view: "h2" },
          { model: "heading3", view: "h3" },
          { model: "heading4", view: "h4" },
          { model: "heading5", view: "h5" },
          { model: "heading6", view: "h6" },
          { model: "pre", view: "pre" },
          ...additionalOptions,
        ];

        const headingConfig = {
          heading: {
            options: newOptions,
          },
        };
        return Object.assign(cfg, headingConfig);
      });

      for (const identifier in pencilCase.headingOptions) {
        richtextToolbar.set("style/" + identifier, {
          commandName: "heading",
          commandArgs: [
            {
              value: identifier,
            },
          ],
          label: pencilCase.headingOptions[identifier].label,
          isVisible: $get("formatting." + identifier),
          isActive: (formattingUnderCursor) =>
            $get("heading", formattingUnderCursor) === identifier,
        });
      }
    }

    // Add custom formatting options
    if (
      pencilCase?.customOptions &&
      typeof pencilCase.customOptions === "object"
    ) {
      for (const identifier in pencilCase.customOptions) {
        const optionConfig = pencilCase.customOptions[identifier];
        const commandName = "pencilCaseCommand:" + identifier;

        richtextToolbar.set(
          "PencilCasePlugin_" + identifier,
          {
            commandName: commandName,
            isActive: $get(commandName),
            isVisible: $get(["formatting", identifier]),

            component: PencilCaseButton,
            icon: optionConfig.icon,
            tooltip: optionConfig.tooltip,
            optionIdentifier: identifier,
            optionConfiguration: optionConfig,
          },
          "end"
        );

        config.set(
          `Networkteam.Neos.PencilCase:CustomOption_${identifier}`,
          (ckEditorConfiguration) => {
            ckEditorConfiguration.plugins = ckEditorConfiguration.plugins || [];
            ckEditorConfiguration.plugins.push(
              PencilCasePlugin(identifier, optionConfig)
            );
            return ckEditorConfiguration;
          }
        );

        if (
          optionConfig.editableAttributes &&
          typeof optionConfig.editableAttributes === "object"
        ) {
          for (const attributeKey in optionConfig.editableAttributes) {
            const attributeValue =
              optionConfig.editableAttributes[attributeKey];

            config.set(
              `Networkteam.Neos.PencilCase:AttributePlugin_${identifier}_${attributeKey}`,
              (ckEditorConfiguration) => {
                ckEditorConfiguration.plugins =
                  ckEditorConfiguration.plugins || [];
                ckEditorConfiguration.plugins.push(
                  AttributePlugin(
                    identifier,
                    optionConfig.tagName,
                    attributeKey,
                    attributeValue
                  )
                );
                return ckEditorConfiguration;
              }
            );
          }
        }
      }
    }
  }
);
