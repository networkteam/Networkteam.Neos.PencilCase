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

manifest(
  'Networkteam.Neos.PencilCase:PencilCase',
  {},
  (globalRegistry, { frontendConfiguration }) => {
    const richtextToolbar = globalRegistry
      .get('ckEditor5')
      .get('richtextToolbar');

    const configCke = globalRegistry.get('ckEditor5').get('config');
    const pencilCase = frontendConfiguration['Networkteam.Neos.PencilCase'];

    configCke.set('configureHeadings', (config) => {
      const additionalOptions = Object.keys(pencilCase.style).map((model) => {
        return {
          model,
          view: {
            name: pencilCase.style[model].element,
						attributes: pencilCase.style[model].attributes
          },
          title: pencilCase.style[model].title,
          class: 'ck-heading_heading_' + model,

          // It needs to be converted before the standard 'heading2'.
          converterPriority: 'high',
        };
      });

      return {
        ...config,
        heading: {
          options: [...additionalOptions],
        },
      };
    });

    // Example of custom headline
    // Don't forget about updating the config registry with relevant config
    // @see https://docs.ckeditor.com/ckeditor5/latest/features/headings.html
    //
    Object.keys(pencilCase.style).forEach((model) => {
      richtextToolbar.set('style/' + model, {
        commandName: 'heading',
        commandArgs: [
          {
            value: model,
          },
        ],
        label: pencilCase.style[model].title,
        isVisible: $get('formatting.' + model),
        isActive: (formattingUnderCursor) =>
          $get('heading', formattingUnderCursor) === model,
      });
    });

    // richtextToolbar.set(
    //   'exampleExtension',
    //   {
    //     // the command name must match the command in examplePlugin.js this.editor.commands.add(...)
    //     commandName: 'highlightCommand',
    //     // the path in isActive must match the commandName from the line above, to ensure the active state
    //     // of the button automatically toggles.
    //     isActive: $get('highlightCommand'),
    //     isVisible: $get([
    //       'formatting',
    //       'Networkteam.Neos.PencilCase:PencilCase',
    //     ]),

    //     component: ExampleButton,
    //     icon: 'plus-square',
    //     tooltip: 'Mark a span',
    //   },
    //   'before strong'
    // );

    const config = globalRegistry.get('ckEditor5').get('config');

    config.set('exampleExtension', addExamplePlugin);
  }
);
