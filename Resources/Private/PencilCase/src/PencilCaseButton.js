import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  IconButton,
  TextInput,
  DropDown,
} from "@neos-project/react-ui-components";
import { neos } from "@neos-project/neos-ui-decorators";

import { executeCommand } from "@neos-project/neos-ui-ckeditor5-bindings";

import "./styles.module.css";

@neos((globalRegistry) => ({
  i18nRegistry: globalRegistry.get("i18n"),
}))
export default class PencilCaseButton extends PureComponent {
  static propTypes = {
    i18nRegistry: PropTypes.object,
    tooltip: PropTypes.string,
    isActive: PropTypes.boolean,
    isOpen: PropTypes.boolean,
  };

  state = {
    isOpen: false,
  };

  handleClick = () => {
    executeCommand("pencilCaseCommand:" + this.props.optionIdentifier);
  };

  handleAttributeChange = (value, attributeKey) => {
    console.log(value);
    executeCommand(
      `PencilCaseEditableAttribute_${this.props.optionIdentifier}_${attributeKey}`,
      value,
      false
    );
  };

  componentWillReceiveProps = (nextProps) => {
    if (!nextProps.isActive) {
      {
        Object.keys(this.props.optionConfiguration.editableAttributes).map(
          (attributeKey) => {
            this.handleAttributeChange("", attributeKey);
          }
        );
      }
    }
  };

  render() {
    const props = {
      onClick: this.handleClick,
      isActive: Boolean(this.props.isActive),
      title: this.props.i18nRegistry.translate(this.props.tooltip),
      icon: this.props.icon,
    };

    console.log(this.props);

    return (
      <DropDown.Stateless
        className="pencilCaseDropdown"
        isOpen={this.state.isOpen}
        onToggle={() => console.log("TOGGLE")}
        onClose={() => console.log("CLOSE")}
        onMouseEnter={() => this.setState({ isOpen: true })}
        onMouseLeave={() => this.setState({ isOpen: false })}
        padded={false}
      >
        <DropDown.Header
          shouldKeepFocusState={false}
          showDropDownToggle={false}
        >
          <IconButton {...props} />
        </DropDown.Header>
        <DropDown.Contents scrollable={true}>
          <ul
            style={{
              position: "fixed",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              zIndex: 1,
              width: 320,
              backgroundColor: "#222",
              border: "8px solid #222",
            }}
          >
            {Object.keys(this.props.optionConfiguration.editableAttributes).map(
              (attributeKey) => (
                <li>
                  <label
                    htmlFor={`__neos__pencilCase-attribute--${attributeKey}`}
                    style={{
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    {/* {i18nRegistry.translate(
                "Neos.Neos.Ui:Main:ckeditor__toolbar__link__title",
                "Title"
              )} */}
                    {attributeKey}
                  </label>
                  <div>
                    <TextInput
                      id={`__neos__pencilCase-attribute--${attributeKey}`}
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
                </li>
              )
            )}
          </ul>
        </DropDown.Contents>
      </DropDown.Stateless>
    );
  }

  getAttributeValue(attributeKey) {
    return this.props.formattingUnderCursor?.[
      `PencilCaseEditableAttribute_${this.props.optionIdentifier}_${attributeKey}`
    ];
  }
}
