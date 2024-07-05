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
  constructor(props) {
    super(props);

    this.contentRef = React.createRef();
  }

  static propTypes = {
    i18nRegistry: PropTypes.object,
    tooltip: PropTypes.string,
    isActive: PropTypes.boolean,
    isOpen: PropTypes.boolean,
  };

  state = {
    isOpen: false,
  };

  handleButtonClick = () => {
    if (
      this.props.optionConfiguration.editableAttributes &&
      !this.state.isOpen
    ) {
      this.setState({ isOpen: true });
      return;
    }

    executeCommand("pencilCaseCommand:" + this.props.optionIdentifier);
  };

  handleClose = (event) => {
    if (
      event &&
      this.contentRef?.current &&
      this.contentRef?.current?.contains(e.target)
    ) {
      return;
    }

    this.setState({ isOpen: false });
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
      isActive: Boolean(this.props.isActive),
      title: this.props.i18nRegistry.translate(this.props.tooltip),
      icon: this.props.icon,
      editableAttributes: this.props.optionConfiguration.editableAttributes,
    };

    return props.editableAttributes ? (
      <DropDown.Stateless
        className="pencilCaseDropdown"
        isOpen={props.isActive && this.state.isOpen}
        onToggle={this.handleButtonClick}
        onClose={this.handleClose}
      >
        <DropDown.Header
          shouldKeepFocusState={false}
          showDropDownToggle={false}
        >
          <IconButton {...props} />
        </DropDown.Header>
        <DropDown.Contents scrollable={true}>
          <ul
            ref={this.contentRef}
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
                    {/* // TODO: Add label and maybe i18n support */}
                    {attributeKey}
                  </label>
                  <div>
                    {/* // TODO: Add placeholder */}
                    <TextInput
                      id={`__neos__pencilCase-attribute--${attributeKey}`}
                      value={this.getAttributeValue(attributeKey) || ""}
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
    ) : (
      <IconButton {...props} />
    );
  }

  getAttributeValue(attributeKey) {
    return this.props.formattingUnderCursor?.[
      `PencilCaseEditableAttribute_${this.props.optionIdentifier}_${attributeKey}`
    ];
  }
}
