import manifest from '@neos-project/neos-ui-extensibility';
import { $add, $get } from 'plow-js';
import ExamplePlugin from './examplePlugin';
import ExampleButton from './ExampleButton';

// addExamplePlugin gets passed two parameters:
// - `ckEditorConfiguration` contains the so-far built CKEditor configuration.
// - `options` is an object with the following fields:
//   - `editorOptions`: gets `[propertyName].ui.inline.editorOptions` from the NodeTypes.yaml
//   - `userPreferences`: `user.preferences` from redux store
//   - `globalRegistry`: the global registry
//   - `propertyDomNode`: the DOM node where the editor should be initialized.
//
// it needs to return the updated ckEditorConfiguration.
const addExamplePlugin = (ckEditorConfiguration, options) => {
  if (
    $get(
      ['formatting', 'Networkteam.Neos.PencilCase:PencilCase'],
      options.editorOptions
    )
  ) {
    ckEditorConfiguration.plugins = ckEditorConfiguration.plugins || [];
    return $add('plugins', ExamplePlugin, ckEditorConfiguration);
  }
  return ckEditorConfiguration;
};

manifest('Networkteam.Neos.PencilCase:PencilCase', {}, (globalRegistry) => {
  const richtextToolbar = globalRegistry
    .get('ckEditor5')
    .get('richtextToolbar');

	const configCke = globalRegistry.get('ckEditor5').get('config');

	// console.log(configCke.get('configureHeadings'));
	console.log('globalRegistry', globalRegistry.get('frontendConfiguration').get('Networkteam.Neos.PencilCase'));

	configCke.set('configureHeadings', config => Object.assign(config, {
		heading: {
			options: [
				{model: 'paragraph'},
				{model: 'heading1', view: 'h1'},
				{model: 'heading2', view: 'h2'},
				{model: 'heading3', view: 'h3'},
				{model: 'heading4', view: 'h4'},
				{model: 'heading5', view: 'h5'},
				{model: 'heading6', view: 'h6'},
				{model: 'pre', view: 'pre'},
				{
					model: 'headingFancy',
					view: {
						name: 'span',
						classes: 'fancy'
					},
					title: 'Heading 2 (fancy)',
					class: 'ck-heading_heading2_fancy',

					// It needs to be converted before the standard 'heading2'.
					converterPriority: 'high'
				}
			]}
	}));

	// wie komm ich an die gloabe Settings yaml


	// // Example of custom headline
	// // Don't forget about updating the config registry with relevant config
	// // @see https://docs.ckeditor.com/ckeditor5/latest/features/headings.html
	//
	richtextToolbar.set('style/fancy', {
	    commandName: 'heading',
	    commandArgs: [{
	        value: 'headingFancy'
	    }],
	    label: 'Fancy',
	    isVisible: $get('formatting.PencilCase.fancy'),
	    isActive: formattingUnderCursor => $get('heading', formattingUnderCursor) === 'headingFancy'
	});

  richtextToolbar.set(
    'exampleExtension',
    {
      // the command name must match the command in examplePlugin.js this.editor.commands.add(...)
      commandName: 'highlightCommand',
      // the path in isActive must match the commandName from the line above, to ensure the active state
      // of the button automatically toggles.
      isActive: $get('highlightCommand'),
      isVisible: $get(['formatting', 'Networkteam.Neos.PencilCase:PencilCase']),

      component: ExampleButton,
      icon: 'plus-square',
      tooltip: 'Mark a span',
    },
    'before strong'
  );

  const config = globalRegistry.get('ckEditor5').get('config');

  config.set('exampleExtension', addExamplePlugin);
});
