import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { IconButton } from "@neos-project/react-ui-components";
import { neos } from "@neos-project/neos-ui-decorators";
import { TextInput } from "@neos-project/react-ui-components";

import { executeCommand } from "@neos-project/neos-ui-ckeditor5-bindings";
import style from "./PencilCaseButton.module.css";

@neos((globalRegistry) => ({
  i18nRegistry: globalRegistry.get("i18n"),
}))
export default class ExampleButton extends PureComponent {
  static propTypes = {
    i18nRegistry: PropTypes.object,
    tooltip: PropTypes.string,
    isActive: PropTypes.boolean,
  };

  handleClick = () => {
    executeCommand("pencilCaseCommand:" + this.props.optionIdentifier);
  };

  handleAttributeChange = (value, attributeKey) => {
    executeCommand(
      `PencilCaseEditableAttribute_${this.props.optionIdentifier}_${attributeKey}`,
      value,
      false
    );
  };

  render() {
    const props = {
      onClick: this.handleClick,
      isActive: Boolean(this.props.isActive),
      title: this.props.i18nRegistry.translate(this.props.tooltip),
      icon: this.props.icon,
    };

    return (
      <div>
        <IconButton {...props} />
        {this.props.optionConfiguration?.editableAttributes && (
          <div className={style.pencilCaseButton__flyout}>
            {Object.keys(this.props.optionConfiguration.editableAttributes).map(
              (attributeKey) => (
                <div>
                  <label
                  // htmlFor="__neos__linkEditor--title"
                  >
                    {/* {i18nRegistry.translate(
                "Neos.Neos.Ui:Main:ckeditor__toolbar__link__title",
                "Title"
              )} */}
                    {attributeKey}
                  </label>
                  <div>
                    <TextInput
                      // id="__neos__linkEditor--title"
                      value={this.getAttributeValue(attributeKey) || ""}
                      // placeholder={i18nRegistry.translate(
                      //   "Neos.Neos.Ui:Main:ckeditor__toolbar__link__titlePlaceholder",
                      //   "Enter link title"
                      // )}
                      onChange={(value) => {
                        this.handleAttributeChange(value, attributeKey);
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  }

  getAttributeValue(attributeKey) {
    return this.props.formattingUnderCursor?.[
      `PencilCaseEditableAttribute_${this.props.optionIdentifier}_${attributeKey}`
    ];
  }
}
