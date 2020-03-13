$(document).ready(function() {

    var mosturflot = "assets/data/mosturflot.csv";

    var mrpgroup = "assets/data/mrp.csv";

    var uport = "assets/data/uport.csv";

    var piter = "assets/data/piter.csv";

     var data = [];

    $.when(
        $.get(mosturflot),
        $.get(mrpgroup),
        $.get(uport),
        $.get(piter),
    ).then(function(mtf, mrp, port, pit) {
        if(processData(mtf[0], 'mosturflot')){
            if(processData(mrp[0], 'mrp')){
                if(processData(port[0], 'uport')){
                    if(processData(pit[0], 'piter')) {
                        InitDatatable();
                    }
                }
            }
        }

    });


    function processData(allText, com) {
        let all = allText.split(/\r\n|\n/);
        let row = '';
        for(let i=1;i<all.length;i++){
            row = all[i].split(',');
            let r = {
                localorder: i,
                name: row[0],
                cityphone: row[1],
                cellphone: row[2],
                officephone: row[3],
                fmc: row[4],
                speciality: row[5],
                department: row[6],
                room: row[7],
                company: com
            };
            data.push(r);
            if(i === all.length - 1){
                return 1;
            }
        }
        return 0;

    }

    var com = 'mrp';
    var companies = {
        mrp: "МРП",
        mosturflot: "Мостурфлот",
        uport: "Южный порт",
        piter: "Русский навигатор"
    };
    function InitDatatable() {
        var t = $('#personal').DataTable({
            dom: '<"right"B>T<"clear"><"top"i>rt',
            buttons: [
                'excel', 'print'
            ],
            data: data,
            language: {
                processing: "Подождите...",
                search: "Поиск:",
                lengthMenu: "Показать _MENU_ записей",
                info: "Записи с _START_ до _END_ из _TOTAL_ записей",
                infoEmpty: "Записи с 0 до 0 из 0 записей",
                infoFiltered: "(отфильтровано из _MAX_ записей)",
                infoPostFix: "",
                loadingRecords: "Загрузка записей...",
                zeroRecords: "Записи отсутствуют.",
                emptyTable: "В таблице отсутствуют данные",
                paginate: {
                    first: "Первая",
                    previous: "Предыдущая",
                    next: "Следующая",
                    last: "Последняя"
                },
                aria: {
                    sortAscending: ": активировать для сортировки столбца по возрастанию",
                    sortDescending: ": активировать для сортировки столбца по убыванию"
                }
            },
            bDeferRender: true,
            bProcessing: true,
            responsive: true,
            iDisplayLength: -1,
            columns: [
                {"data": "localorder"},
                {"data": "name"},
                {"data": "cityphone", "class": "nowrap"},
                {"data": "cellphone", "class": "nowrap"},
                {"data": "officephone"},
                {"data": "fmc"},
                {"data": "speciality"},
                {"data": "department"},
                {"data": "room"},
                {"data": "company", "class": "nowrap"}
            ],
            "createdRow": function (row, data) {
                $.each(companies, function (k, v) {
                    if (k === data['company'])
                        $('td', row).eq(9).text(v);
                });
            },
            "initComplete": function () {
                this.api().columns(9).every(function () {
                    var column = this;
                    if (com.length > 0) {
                        column.search(com).draw();
                    }
                });

            }
        });

        t.on('order.dt search.dt', function () {
            t.column(0, {search: 'applied', order: 'applied'}).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        }).draw();

        $('#company').on('change', function () {
            t.columns(9).search(this.value).draw();
        });

        $('#qsearch').on('keyup', function () {
            t.columns(9).search('').draw();
            t.search(this.value).draw();
            if (this.value.length < 3) {
                t.columns(9).search($('#company').val()).draw();
            }

        });
    }

} );
