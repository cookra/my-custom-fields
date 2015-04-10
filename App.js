Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:[
        {
            xtype: 'text',
            html: 'ok',
            itemId: 'boxContainer'
        }
    ],
    launch: function() {
        var filters = Ext.create('Rally.data.QueryFilter', {
                property: 'ElementName',
                operator: '=',
                value: 'Defect'
            });
            filters = filters.or({
                property: 'ElementName',
                operator: '=',
                value: 'HierarchicalRequirement'  
            });
            filters = filters.or({
                property: 'ElementName',
                operator: '=',
                value: 'TestCase'  
            });
            filters = filters.or({
                property: 'ElementName',
                operator: '=',
                value: 'Task'  
            });
            
        var typeDefCombobox = Ext.create('Rally.ui.combobox.ComboBox', {
                itemId: 'typeDefCombobox',
                storeConfig: {
                    autoLoad: true,
                    model: 'TypeDefinition',
                    fetch: ['Attributes','ElementName'],
                    valueField: 'ElementName',  
                    filters:[filters],
                    limit: Infinity
                },
                listeners:{
                    ready: function(combobox){
                        this._loadCustomFields(combobox.getRecord());
                    },
                    select: function(combobox){
                        this._loadCustomFields(combobox.getRecord());
                    },
                    scope: this
   		}
            });
            this.add(typeDefCombobox);
    },
    _loadCustomFields:function(record){
        var that = this;
        var attributes = record.getCollection('Attributes');
        var count = attributes.getCount();
        var pendingAttributes = count;
        var fieldsArray = [];
        attributes.load({
            fetch:['ElementName','Custom','AttributeType'],
            callback: function(fields, operation, success){
                _.each(fields, function(field){
                    if (field.get('Custom') === true) {
                        fieldsArray.push({'name':field.get('ElementName'),'type':field.get('AttributeType')});
                    }
                    pendingAttributes--;
                    if (pendingAttributes === 0) {
                        that._buildCustomFieldsCombobox(fieldsArray);
                    }
                    
                }); 
            }
        });
    },
    _buildCustomFieldsCombobox:function(fields){
        console.log(fields);
        if (fields.length>0) { 
            var customFieldsStore = Ext.create('Rally.data.custom.Store', {
                autoLoad: true,
                fields: ['name','type'],
                data: fields
            });
        }
    }
});