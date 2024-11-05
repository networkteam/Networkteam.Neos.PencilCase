# Networkteam.Neos.PencilCase

## Installation

1. Install the package into the root-folder of your Project with `composer require networkteam/neos-pencilcase`
1. Then you create the Settings.PencilCase.yaml in the Configurations Folder of the DistributionPackages.
1. At last you add the package as a dependency to the composer.json of the DistributionPackages as well:
```json
{
  "require": {
    "networkteam/neos-pencilcase": "*",
  }
}
```

## Usage

Now it is possible to define custom Options in the Settings.PencilCase.yaml. The options can be addressed in the NodeType-Definitions. Under editorOptions/formatting it is possible to name and activate the custom options.

#### NodeType.yaml

```yaml
  ui:
    inline:
      editorOptions:
        formatting:
          violet: true
          fancy: true
```

## Example Settings.PencilCase.yaml

Customize your CKeditor using a yaml file

```yaml
Neos:
  Neos:
    Ui:
      frontendConfiguration:
        Networkteam.Neos.PencilCase:
          # the heading options will be added to the dropdown menu for blockstyles
          headingOptions:
            fancy:
              label: Fancy
              tagName: span
              attributes:
                class: fancy
                data-nwt-plugin: nwt.awesomeSpecialTextEffect
                style:
                  color: tomato
          # customOptions will be added as buttons
          customOptions:
            violet:
              tooltip: Highlight
              icon: rocket
              tagName: span
              # are fixed when set in config
              attributes:
                class: 'highlight'
                style:
                  background: violet
              # will be editable inside ckEditor
              editableAttributes:
                # set a custom anchor inside your copytext
                id:
                  # add label to the input field (falling back to attribute name), with i18n support
                  label: ID
                  # add a placeholder to the input field, with i18n support
                  placeholder: Vendor.Site:Main:id.placeholder
                # add information to certain parts of copytext
                data-test: true
                # native tooltip
                title: true
```
