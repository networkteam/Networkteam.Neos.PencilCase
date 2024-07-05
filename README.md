# Networkteam.Neos.PencilCase

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
              attributes:             # are fixed when set in config
                class: 'highlight'
                style:
                  background: violet
              editableAttributes:     # will be editable inside ckEditor
                id: true              # set a custom anchor inside your copytext
                data-test: true       # add information to certain parts of copytext
                title: true           # native tooltip
```
