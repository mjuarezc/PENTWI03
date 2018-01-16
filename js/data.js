var Rate = function (currency, value) {
    this.currency = currency;
    this.value = value;
};
Rate.prototype.toString = function () {
    var describe =  this.currency + ': ' + this.value;
    console.log(describe);
    return describe;
};

function FixerRate(currency, value, base, date) {
    Rate.call(this, currency, value);
    this.base = base;
    this.date = date;
}
FixerRate.prototype = Object.create(Rate.prototype);
FixerRate.prototype.constructor = Rate;

FixerRate.prototype.toString = function () {
    var describe =  this.currency + ': ' + this.value+', Base: ' + this.base+' on '+ this.date;
    console.log(describe);
    return describe;
};
$(document).ready(function() {
    var apiURL = 'https://api.fixer.io/';
    var date = '2017-12-30';
    var base = 'USD';
    var date_input = $('#currency-date');
    date_input.val(date);
    var options={
        format: 'yyyy-mm-dd',
        todayHighlight: true,
        autoclose: true,
    };
    date_input.datepicker(options);
    $('#example').DataTable({
        "columnDefs": [ {
            "targets": -1,
            "data": null,
            "render": function ( data, type, row, meta ) {
                return '<button type="button" name="edit" class="btn btn-default" > <span class="glyphicon glyphicon-pencil"></span> </button>'+
                    '<button type="button" name="delete" class="btn btn-danger" > <span class="glyphicon glyphicon-trash"></span> </button>'+
                    '<button type="button" name="show" class="btn btn-primary" > <span class="glyphicon glyphicon-search"></span> </button>'+
                    '<button type="button" name="show-detail" class="btn btn-primary" > <span class="glyphicon glyphicon-zoom-in"></span> </button>'
                    ;
            }
        } ]
    });
    createTable(apiURL, date, base);

    $('#currency-base, #currency-date').change(function (event) {
        console.log(event);
        var base = $('#currency-base').val();
        var date = $('#currency-date').val();
        if(base && date) {
            createTable(apiURL,date,base)
        } else {
            alert('Verify input data');
        }
    });
} );

function createTable(url, date, base) {
    var table = $('#example').DataTable();
    table.clear();
    $.get(url + date,{base : base })
        .done(function (data) {
            for(var rate in data.rates) {
                table.row.add( [
                    data.date,
                    data.base,
                    rate,
                    data.rates[rate],
                    ''
                ] ).draw( false );
            }
            $(':button[name="delete"]').click(function() {
                table.row( $(this).parents('tr') ).remove().draw();
            } );

            $(':button[name="edit"]').click(function() {
                var row = table.row( $(this).parents('tr') );
                console.log(row);
                var data = row.data();
                $('#date-form').val(data[0]);
                $('#base-form').val(data[1]);
                $('#currency-form').val(data[2]);
                $('#value-form').val(data[3]);
                $('#modal').modal('show').submit(function (event) {
                    event.preventDefault();
                    try{
                        data[0]=$('#date-form').val();
                        data[1]=$('#base-form').val();
                        data[2]=$('#currency-form').val();
                        data[3]=$('#value-form').val();
                        if(data[3] <= 0){
                            throw('Value must be greater than 0');
                        }
                        console.log(data);
                        row.data(data).draw();
                        $('#modal').modal('hide');
                    } catch (e){
                        alert('Error: ' + e);
                    }
                });
            } );

            $(':button[name="show"]').click(function() {
                var data = table.row( $(this).parents('tr') ).data();
                var rate = new Rate(data[2], date[3]);
                $('#show-modal-content').append(rate.toString());
                $('#show-modal').modal('show');
            } );

            $(':button[name="show-detail"]').click(function() {
                var data = table.row( $(this).parents('tr') ).data();
                var rate = new FixerRate(data[2], date[3], data[1], data[0]);
                $('#show-modal-content').append(rate.toString());
                $('#show-modal').modal('show');
            } );

        }).fail(function (err) {
        console.log(err);
    });
}