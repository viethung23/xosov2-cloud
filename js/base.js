//Type.registerNamespace("Xoso");
var xoso_base;

Base = function() {
    var that = this;

    that.init = function() {
        // Tải file template từ header-base.html
        $.get('/templateHtml/header-base.html', function(templateContent) {
            // Append template vào body
            $("body").append(templateContent);

            // Sử dụng template sau khi đã được tải
            const template = $("#header-temp").html();
            if (template) {
                $(".header").append(template);
                that.updateDateTime(); // Cập nhật thời gian sau khi append
            } else {
                console.error("Không tìm thấy template #header-temp trong header-base.html");
            }
        }).fail(function() {
            console.error("Không tải được file header-base.html");
        });

        that.GetXSMN();
        that.OnclickAi();
    };

    // hàm lấy thời gian hiện tại 
    that.updateDateTime = function(){
        const now = new Date();
        // Lấy ngày, tháng, năm
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng trong JS bắt đầu từ 0
        const year = now.getFullYear();
        // Lấy thứ trong tuần
        const daysOfWeek = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
        const dayOfWeek = daysOfWeek[now.getDay()];
        // Định dạng thời gian theo yêu cầu
        const formattedDateTime = `Hôm nay: ${dayOfWeek} ngày ${day}/${month}/${year}`;
        // Cập nhật nội dung của thẻ div với định dạng thời gian
        // Kiểm tra phần tử .header-time trước khi cập nhật nội dung
        if ($(".header-time").length > 0) {
            $(".header-time").text(formattedDateTime);
        } else {
            console.error("Không tìm thấy phần tử .header-time");
        }
    }

    that.OnclickAi = function(){
        $('.tab-button').click(function () {
            // Remove active class from all buttons
            $('.tab-button').removeClass('active');
            
            // Hide all tab contents
            $('.tab-content').hide();
            
            // Add active class to clicked button and show corresponding content
            $(this).addClass('active');
            $('#' + $(this).data('tab')).show();
        });
    }

    that.getDisplayText = function(dateString) {
        const targetDate = new Date(dateString); // Chuyển chuỗi thành Date
        const currentDate = new Date(); // Ngày hiện tại

        // Đặt giờ của cả hai ngày về 0 để so sánh ngày chính xác
        targetDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        const differenceInDays = (currentDate - targetDate) / (1000 * 60 * 60 * 24);
        if (differenceInDays === 0 || differenceInDays === -1) {
            return 'hôm nay'; // Nếu là hôm nay hoặc hôm qua
        } else {
            const [year, month, day] = dateString.split('-');
            return `Ngày ${day}-${month}-${year}`; // Hiển thị dạng dd-MM-yyyy
        }
    }

    // that.ActiveMenu = function () {
    //     const fullPath = $(location).attr('pathname'); 
    //     console.log(fullPath)
    //     if(fullPath == '/xo-so-mien-bac/xsmb-p1.html'){
    //         $("#menu_a_xsmb").addClass("active");
    //     }
    //     if(fullPath == '/xo-so-mien-nam/xsmn-p1.html'){
    //         $("#menu_a_xsmn").addClass("active");
    //     }
    //     if(fullPath == '/xo-so-mien-trung/xsmt-p1.html'){
    //         $("#menu_a_xsmt").addClass("active");
    //     }
    // }
    

    that.GetXSMN = function () {
        // Dữ liệu mẫu
        // const dataArray =
        // [
        //     {
        //         loai : 'mn',
        //         dateCode : 17112024,
        //         date: "2024-11-17",
        //         provinces: ["Tiền Giang", "Kiên Giang", "Đà Lạt"],
        //         prizes: [
        //             { rank: "8", "Tiền Giang": ["48"], "Kiên Giang": ["26"], "Đà Lạt": ["98"] },
        //             { rank: "7", "Tiền Giang": ["806"], "Kiên Giang": ["721"], "Đà Lạt": ["370"] },
        //             { rank: "6", "Tiền Giang": ["1420", "9461", "9506"], "Kiên Giang": ["6182", "5600", "4095"], "Đà Lạt": ["8489", "5295", "2116"] },
        //             { rank: "5", "Tiền Giang": ["0907"], "Kiên Giang": ["0558"], "Đà Lạt": ["9021"] },
        //             { rank: "4", "Tiền Giang": ["86704", "24502", "19317", "49279", "66791", "54431", "52826"], "Kiên Giang": ["42560", "67515", "23541", "78169", "90308", "33705", "33358"], "Đà Lạt": ["76842", "63546", "11519", "92118", "10376", "87555", "54558"] },
        //             { rank: "3", "Tiền Giang": ["85158", "08199"], "Kiên Giang": ["89963", "84048"], "Đà Lạt": ["56253", "58569"] },
        //             { rank: "2", "Tiền Giang": ["32992"], "Kiên Giang": ["01199"], "Đà Lạt": ["02637"] },
        //             { rank: "1", "Tiền Giang": ["12936"], "Kiên Giang": ["13545"], "Đà Lạt": ["33444"] },
        //             { rank: "ĐB", "Tiền Giang": ["271382"], "Kiên Giang": ["833062"], "Đà Lạt": ["688830"] }
        //         ]
        //     },
        //     {
        //         loai : 'mn',
        //         dateCode : 18112024,
        //         date: "2024-11-18",
        //         provinces: ["Tiền Giang", "Kiên Giang", "Đà Lạt"],
        //         prizes: [
        //             { rank: "8", "Tiền Giang": ["48"], "Kiên Giang": ["26"], "Đà Lạt": ["98"] },
        //             { rank: "7", "Tiền Giang": ["806"], "Kiên Giang": ["721"], "Đà Lạt": ["370"] },
        //             { rank: "6", "Tiền Giang": ["1420", "9461", "9506"], "Kiên Giang": ["6182", "5600", "4095"], "Đà Lạt": ["8489", "5295", "2116"] },
        //             { rank: "5", "Tiền Giang": ["0907"], "Kiên Giang": ["0558"], "Đà Lạt": ["9021"] },
        //             { rank: "4", "Tiền Giang": ["86704", "24502", "19317", "49279", "66791", "54431", "52826"], "Kiên Giang": ["42560", "67515", "23541", "78169", "90308", "33705", "33358"], "Đà Lạt": ["76842", "63546", "11519", "92118", "10376", "87555", "54558"] },
        //             { rank: "3", "Tiền Giang": ["85158", "08199"], "Kiên Giang": ["89963", "84048"], "Đà Lạt": ["56253", "58569"] },
        //             { rank: "2", "Tiền Giang": ["32992"], "Kiên Giang": ["01199"], "Đà Lạt": ["02637"] },
        //             { rank: "1", "Tiền Giang": ["12936"], "Kiên Giang": ["13545"], "Đà Lạt": ["33444"] },
        //             { rank: "ĐB", "Tiền Giang": ["271382"], "Kiên Giang": ["833062"], "Đà Lạt": ["688830"] }
        //         ]
        //     }
        // ]

        // const dataArray =
        // [
        //     {
        //         loai : 'mn',
        //         dateCode : 17112024,
        //         date: "2024-11-30",
        //         provinces: ["Tiền Giang", "Kiên Giang"],
        //         prizes: [
        //             { rank: "8", "Tiền Giang": ["48"], "Kiên Giang": ["26"] },
        //             { rank: "7", "Tiền Giang": ["806"], "Kiên Giang": ["721"] },
        //             { rank: "6", "Tiền Giang": ["1420", "9461", "9506"], "Kiên Giang": ["6182", "5600", "4095"] },
        //             { rank: "5", "Tiền Giang": ["0907"], "Kiên Giang": ["0558"] },
        //             { rank: "4", "Tiền Giang": ["86704", "24502", "19317", "49279", "66791", "54431", "52826"], "Kiên Giang": ["42560", "67515", "23541", "78169", "90308", "33705", "33358"] },
        //             { rank: "3", "Tiền Giang": ["85158", "08199"], "Kiên Giang": ["89963", "84048"] },
        //             { rank: "2", "Tiền Giang": ["32992"], "Kiên Giang": ["01199"] },
        //             { rank: "1", "Tiền Giang": ["12936"], "Kiên Giang": ["13545"] },
        //             { rank: "ĐB", "Tiền Giang": ["271382"], "Kiên Giang": ["833062"] }
        //         ]
        //     },
        //     {
        //         loai : 'mn',
        //         dateCode : 17112024,
        //         date: "2024-11-17",
        //         provinces: ["Tiền Giang", "Kiên Giang"],
        //         prizes: [
        //             { rank: "8", "Tiền Giang": ["48"], "Kiên Giang": ["26"] },
        //             { rank: "7", "Tiền Giang": ["806"], "Kiên Giang": ["721"] },
        //             { rank: "6", "Tiền Giang": ["1420", "9461", "9506"], "Kiên Giang": ["6182", "5600", "4095"] },
        //             { rank: "5", "Tiền Giang": ["0907"], "Kiên Giang": ["0558"] },
        //             { rank: "4", "Tiền Giang": ["86704", "24502", "19317", "49279", "66791", "54431", "52826"], "Kiên Giang": ["42560", "67515", "23541", "78169", "90308", "33705", "33358"] },
        //             { rank: "3", "Tiền Giang": ["85158", "08199"], "Kiên Giang": ["89963", "84048"] },
        //             { rank: "2", "Tiền Giang": ["32992"], "Kiên Giang": ["01199"] },
        //             { rank: "1", "Tiền Giang": ["12936"], "Kiên Giang": ["13545"] },
        //             { rank: "ĐB", "Tiền Giang": ["271382"], "Kiên Giang": ["833062"] }
        //         ]
        //     }
        // ]

        
        //console.log(JSON.stringify(dataArray))
        var dataArray = JSON.parse('[{"loai":"mn","code":17112024,"date":"2024-11-30","provinces":["Tiền Giang","Kiên Giang","Đà Lạt"],"prizes":[{"rank":"8","Tiền Giang":["48"],"Kiên Giang":["26"],"Đà Lạt":["98"]},{"rank":"7","Tiền Giang":["806"],"Kiên Giang":["721"],"Đà Lạt":["370"]},{"rank":"6","Tiền Giang":["1420","9461","9506"],"Kiên Giang":["6182","5600","4095"],"Đà Lạt":["8489","5295","2116"]},{"rank":"5","Tiền Giang":["0907"],"Kiên Giang":["0558"],"Đà Lạt":["9021"]},{"rank":"4","Tiền Giang":["86704","24502","19317","49279","66791","54431","52826"],"Kiên Giang":["42560","67515","23541","78169","90308","33705","33358"],"Đà Lạt":["76842","63546","11519","92118","10376","87555","54558"]},{"rank":"3","Tiền Giang":["85158","08199"],"Kiên Giang":["89963","84048"],"Đà Lạt":["56253","58569"]},{"rank":"2","Tiền Giang":["32992"],"Kiên Giang":["01199"],"Đà Lạt":["02637"]},{"rank":"1","Tiền Giang":["12936"],"Kiên Giang":["13545"],"Đà Lạt":["33444"]},{"rank":"ĐB","Tiền Giang":["271382"],"Kiên Giang":["833062"],"Đà Lạt":["688830"]}]},{"loai":"mn","code":18112024,"date":"2024-11-29","provinces":["Tiền Giang","Kiên Giang","Đà Lạt"],"prizes":[{"rank":"8","Tiền Giang":["48"],"Kiên Giang":["26"],"Đà Lạt":["98"]},{"rank":"7","Tiền Giang":["806"],"Kiên Giang":["721"],"Đà Lạt":["370"]},{"rank":"6","Tiền Giang":["1420","9461","9506"],"Kiên Giang":["6182","5600","4095"],"Đà Lạt":["8489","5295","2116"]},{"rank":"5","Tiền Giang":["0907"],"Kiên Giang":["0558"],"Đà Lạt":["9021"]},{"rank":"4","Tiền Giang":["86704","24502","19317","49279","66791","54431","52826"],"Kiên Giang":["42560","67515","23541","78169","90308","33705","33358"],"Đà Lạt":["76842","63546","11519","92118","10376","87555","54558"]},{"rank":"3","Tiền Giang":["85158","08199"],"Kiên Giang":["89963","84048"],"Đà Lạt":["56253","58569"]},{"rank":"2","Tiền Giang":["32992"],"Kiên Giang":["01199"],"Đà Lạt":["02637"]},{"rank":"1","Tiền Giang":["12936"],"Kiên Giang":["13545"],"Đà Lạt":["33444"]},{"rank":"ĐB","Tiền Giang":["271382"],"Kiên Giang":["833062"],"Đà Lạt":["688830"]}]}]')

        // Tạo nội dung HTML
        let htmlContent = dataArray.map(data => `
            <section class="section" id="${data.loai}_kqngay_${data.code}"> 
                <header class="section-header">
                    <h1>XSMN - Kết quả xổ số Miền Nam - XSMN ${that.getDisplayText(data.date)}</h1>
                    <h2 class="site-link">
                        <a title="XSMN" href="/xo-so-mien-nam/xsmn-p1.html">XSMN</a>
                        <a title="XSMN ${data.date}" href="/xsmn-${data.code}.html">XSMN ${data.date}</a> 
                    </h2>
                </header>
    
                <div class="section-content" id="${data.loai}_kqngay_${data.code}">
                    <table class="table-result table-xsmn">
                        <thead>
                            <tr>
                                <th class="name-prize">Giải</th>
                                ${data.provinces.map(province => `<th class="prize-col3"><h3>${province}</h3></th>`).join("")}
                            </tr>
                        </thead>
                        <tbody>
                            ${data.prizes.map(prize => `
                                <tr>
                                    <th>${prize.rank}</th>
                                    ${data.provinces.map(province => `
                                        <td><span class="xs_prize ${prize.rank == 'ĐB' ? 'prize_db' : ''}">${prize[province].join("<br>")}</span></td>
                                    `).join("")}
                                </tr>
                            `).join("")}
                        </tbody>
                    </table> 
                    <div class=div-table>
                        <div class="config-item active" value=0>Đầy đủ</div>
                        <div class=config-item value=2>2 số</div>
                        <div class=config-item value=3>3 số</div>
                        <div class=number-config data-number=0>0</div>
                        <div class=number-config data-number=1>1</div>
                        <div class=number-config data-number=2>2</div>
                        <div class=number-config data-number=3>3</div>
                        <div class=number-config data-number=4>4</div>
                        <div class=number-config data-number=5>5</div>
                        <div class=number-config data-number=6>6</div>
                        <div class=number-config data-number=7>7</div>
                        <div class=number-config data-number=8>8</div>
                        <div class=number-config data-number=9>9</div>
                    </div>   
                </div>   
            </section>     
        `).join("");

        // Đưa nội dung vào thẻ div
        $(".content-left").html(htmlContent);
    }

    // luôn luôn gọi hàm init khi khởi tạo new
    that.init();
}

// $(document).ready(function () {
//     xoso_base = new Base();
// });

jQuery(function () { xoso_base = new Base(); });