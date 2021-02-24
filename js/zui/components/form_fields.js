define([
    'zui',
    "zuiRoot/view_templates/forms_basic",
], function (
    zui,
    zui_forms_basic,
) {
    var MODULE_NAME = "zui_forms_fields";
    // var TOOLBAR_CLASSES = ['toolbar-container'];
    // var TOOLBAR_BUTTON_CLASSES = ['toolbar-button'];

    // TODO -- Add:
    // Array / Object Editors
    // Date / DateTime Pickers

    // FORM HELPERS
    // -- Change Watcher
    // -- Validation
    // 

    var _GetFieldTypeFromValue = function (value) {
        var type = typeof value;

        if (type === "string" && value.length > 150) {
            return "TextArea";
        } else if (type === "string") {
            return "Input-Text";
        } else if (type === "number") {
            return "Input-Number";
        } else if (type === "boolean") {
            return "Input-Checkbox";
        } else if (Array.isArray(value)) {
            return "Array";
        } else if (type.indexOf("object") > -1) {
            return "Dictionary";
        }
        // undefined / null
    };


    // -- Form Input Creators --
    var _CreateLabel = function (display, forField) {
        var label = document.createElement('label');

        if (typeof display !== "string" && Array.isArray(display)) {
            label.textContent = '[' + display.toString() + ']';
        }
        else {
            label.textContent = display.toString();
        }

        if (forField) {
            label.for = forField;
        }

        return label;
    };

    var _CreateInput = function (name, type, value, hierarchy) {
        var input = document.createElement('input');
        input.classList.add('form-control');
        input.name = name;
        input.type = type;
        if (hierarchy) {
            input.setAttribute("hierarchy", hierarchy);
        }
        input.placeholder = name + ' <' + type + '>';

        if (type === "checkbox") {
            input.checked = value;
        } else {
            input.value = value;
        }

        return input;
    };

    var _CreateButton = function (name, type) {
        var input = document.createElement('button');
        input.classList.add('btn');
        input.classList.add('btn-' + type);
        input.textContent = name;
        return input;
    };

    var _CreateTextArea = function (name, value, maxLength, hierarchy) {
        maxLength = maxLength ? maxLength : 100000;

        var area = document.createElement('TextArea');
        //area.classList.add('form-control');
        area.name = name;
        area.value = value.length > maxLength ? value.substring(0, maxLength - 3) + "..." : value;
        area.maxLength = maxLength;
        area.placeholder = "Enter up to [" + maxLength + "] characters.";
        if (hierarchy) {
            area.setAttribute("hierarchy", hierarchy);
        }

        return area;
    };

    var _CreateSelect = function (name, options, selectedIndex, hierarchy) {

        var select = document.createElement('select');
        select.classList.add('form-control');
        select.name = name;

        for (var key in options) {
            var option = document.createElement('option');
            option.value = key;
            option.textContent = options[key];

            if (selectedIndex === key || selectedIndex === options[key]) {
                option.selected = true;
            }

            select.add(option);
        }
        select.setAttribute("hierarchy", hierarchy);
        return select;
    };


    // MODULE ------------------------------------------------------------------------------------------------------------------------ 
    var _forms = {
        DefaultPropertyDisplay_hy: function (settings) {
            settings.prop = settings.prop || "";
            var fieldType = settings.fieldType || _GetFieldTypeFromValue(settings.value);
            if (!bp.Data.Clean.Json.length && typeof settings.value === 'object' && !(Array.isArray(settings.value))) {
                bp.ClearData();
                bp.NewBluePrint(settings.value);
            }
            var field = this.CreateField(fieldType, settings);

            // need a way to wrap in interface.
            // still feel like this logic is a bit buggy and there are some uncovered edge cases here.
            if (!settings.prop && !settings.autogroup) {
                return field;
            }
            else if (fieldType === "Dictionary" || fieldType === "Array") {
                return _WrapInFormGroup(field);
            }
            else if (!settings.autogroup) {
                return _WrapInFragment([_CreateLabel(settings.prop, field.name), field]);
            }
            else if (!settings.prop) {
                return _WrapInFormGroup(field);
            }
            else if (settings.prop && settings.autogroup) {
                var keyField = settings.isKeyEditable ? this.CreateField(fieldType, settings) : _CreateLabel(settings.prop, field.name, settings);
                return _WrapInFormGroup([keyField, field]);
            }
        },
        CreateField_hy: function (fieldType, settings) {
            var field = {};
            settings.hasParent = !settings.hasParent ? (!settings.parentIndex ? false : true) : settings.hasParent;
            switch (fieldType) {
                case "TextArea":
                    field = _CreateTextArea(settings.prop, settings.value, null, settings.hierarchy);
                    if (!settings.isEditable) {
                        field.disabled = true;
                    }
                    else if (settings.recordChanges !== false) {
                        _AddChangeWatcher(field, settings.validation);
                    }
                    break;
                case "Input-Text":
                    field = _CreateInput(settings.prop, "text", settings.value, settings.hierarchy);

                    if (!settings.isEditable) {
                        field.disabled = true;
                    }
                    else if (settings.recordChanges !== false) {
                        _AddChangeWatcher(field, settings.validation);
                    }
                    break;
                case "Input-Number":
                    field = _CreateInput(settings.prop, "number", settings.value, settings.hierarchy);

                    if (!settings.isEditable) {
                        field.disabled = true;
                    }
                    else if (settings.recordChanges !== false) {
                        _AddChangeWatcher(field, settings.validation);
                    }
                    break;
                case "Input-Checkbox":
                    field = _CreateInput(settings.prop, "checkbox", settings.value, settings.hierarchy);

                    if (!settings.isEditable) {
                        field.disabled = true;
                    }
                    else if (settings.recordChanges !== false) {
                        _AddChangeWatcher(field, settings.validation);
                    }
                    break;
                case "Input-Password":
                    field = _CreateInput(settings.prop, "password", settings.value, settings.hierarchy);

                    if (!settings.isEditable) {
                        field.disabled = true;
                    }
                    else if (settings.recordChanges !== false) {
                        _AddChangeWatcher(field, settings.validation);
                    }
                    break;
                case "Array":
                    field = _CreateArrayList(settings.prop, settings.value, settings.isEditable, true, settings.hierarchy);
                    break;
                case "Dictionary":
                    field = _CreateDictionaryList(settings);
                    break;
                case "Select":
                    field = _CreateSelect(settings.prop, settings.optionGroup, settings.value, settings.hierarchy);
                    if (!settings.isEditable) {
                        field.disabled = true;
                    }
                    else if (settings.recordChanges !== false) {
                        _AddChangeWatcher(field);
                    }
                    break;
                case "Date":
                    if (!settings.isEditable) {
                        field = _CreateInput(settings.prop, "text", settings.value, settings.hierarchy);

                        field.disabled = true;
                    }
                    else {
                        field = _CreateDatePicker(settings.value, settings.hierarchy);

                        var input = field.querySelector('input.dateValue');

                        if (input && (settings.hierarchy || settings.hierarchy === 0)) {
                            console.log('bind date !', input);
                            bp.BindToData(settings.hierarchy, input, settings.isKey);
                        }
                    }
                    break;
                case "DateTime":
                    if (!settings.isEditable) {
                        field = _CreateInput(settings.path, "text", settings.value, settings.hierarchy);
                        field.disabled = true;
                    }
                    else {
                        field = _CreateDateTimePicker(settings.value, settings.hierarchy);

                        var dtInput = field.querySelector('input.dateValue');

                        if (dtInput && (settings.hierarchy || settings.hierarchy === 0)) {
                            console.log('bind date !', dtInput);
                            bp.BindToData(settings.hierarchy, dtInput, settings.isKey);
                        }
                    }
                    break;
            }

            if (settings.isNested) {
                field.classList.add(NESTED_INPUT_CLASS);
            }

            if (fieldType !== "Dictionary" && fieldType !== "Array") {
                _ApplyDefaultInputClasses(field);
            }

            var parsedValue;
            if (fieldType === "Array") {
                parsedValue = JSON.stringify(settings.value);
            }
            else {
                parsedValue = settings.value;
            }

            field.setAttribute(INITAL_VALUE_ATTRIBUTE, parsedValue);
            if (!field.getAttribute('hierarchy')) {
                field.setAttribute('hierarchy', settings.hierarchy);
            }

            if ((fieldType !== "Date" && fieldType !== "DateTime") && (settings.hierarchy || settings.hierarchy === 0)) {

                bp.BindToData(settings.hierarchy, field, settings.isKey);
            }
            return field;
        },
        CreateLabel_hy: function (display, forField) {
            return _CreateLabel(display, forField);
        }
    };

    return _forms;
});
