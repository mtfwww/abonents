$(document).ready(function() {

    const mosturflot = "assets/data/mosturflot.csv";

    const mrpgroup = "assets/data/mrp.csv";

    const offices = "assets/data/offices.csv";

    const piter = "assets/data/piter.csv";

    const ships = "assets/data/ships.csv";

    const data = [];

    $.when(
        $.get(mosturflot),
        $.get(mrpgroup),
        $.get(offices),
        $.get(piter),
        $.get(ships),
    ).then(function(mtf, mrp, off, pit, shp) {
        if(processData(mtf[0], 'mosturflot')){
            if(processData(mrp[0], 'mrp')){
                if(processData(off[0], 'offices')) {
                    if(processData(pit[0], 'piter')) {
                        if(processData(shp[0], 'ships')) {
                            InitDatatable();
                        }
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
                name: row[0].replace(/"/g, ''),
                cityphone: row[1].replace(/"/g, ''),
                cellphone: row[2].replace(/"/g, ''),
                officephone: row[3].replace(/"/g, ''),
                fmc: row[4].replace(/"/g, ''),
                speciality: row[5].replace(/"/g, ''),
                department: row[6].replace(/"/g, ''),
                room: row[7].replace(/"/g, ''),
                org: row[8].replace(/"/g, ''),
                company: com
            };
            data.push(r);
            if(i === all.length - 1){
                return 1;
            }
        }
        return 0;

    }

    let com = 'mrp';
    const companies = {
        mrp: "Ривер Сити",
        mosturflot: "ХМСЗ",
        offices: "Офисы продаж",
        piter: "Офис Питер",
        ships: "Теплоходы"
    };
    function InitDatatable() {
        const t = $('#personal').DataTable({
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
                {"data": "org"},
                {"data": "company", "class": "nowrap"}
            ],
            columnDefs: [
                { targets: [10], visible: false, searchable: true},
            ],
            "createdRow": function (row, data) {
                $.each(companies, function (k, v) {
                    if (k === data['company'])
                        $('td', row).eq(10).text(v);
                });
            },
            "initComplete": function () {
                this.api().columns(10).every(function () {
                    let column = this;
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
            t.columns(10).search(this.value).draw();
        });

        $('#qsearch').on('keyup', function () {
            t.columns(10).search('').draw();
            t.search(this.value).draw();
            if (this.value.length < 3) {
                t.columns(10).search($('#company').val()).draw();
            }

        });
    }

} );
