import React from 'react';
import { IconButton } from '@neos-project/react-ui-components';
import { neos } from '@neos-project/neos-ui-decorators';

import { executeCommand } from '@neos-project/neos-ui-ckeditor5-bindings';

// @neos(globalRegistry => ({
//     i18nRegistry: globalRegistry.get('i18n')
// }))

export default function ExampleButton({ isActive, icon, tooltip }) {
  const handleClick = () => {
    // this command name must match the identifier of the command from examplePlugin.js, this.editor.commands.add(...)
    executeCommand('highlightCommand');
  };

  return (
    <IconButton
      onClick={handleClick}
      isActive={Boolean(isActive)}
      // title={i18nRegistry.translate(tooltip)}
      icon={icon}
    />
  );
}
