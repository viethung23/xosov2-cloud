var xoso_index;

Index = function() {
    var that = this;
    var hostApi = 'https://apixosov2.viethungdev23.workers.dev';

    that.init = function() {
        $(".content-left").html('');
        that.updateDateTime();
        that.loadAllData(); // Gọi hàm load dữ liệu bất đồng bộ
        //that.OnclickAi();
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

    // that.OnclickAi = function(){
    //     $('.tab-button').click(function () {
    //         // Remove active class from all buttons
    //         $('.tab-button').removeClass('active');
            
    //         // Hide all tab contents
    //         $('.tab-content').hide();
            
    //         // Add active class to clicked button and show corresponding content
    //         $(this).addClass('active');
    //         $('#' + $(this).data('tab')).show();
    //     });
    // }

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

    that.GetXSMN = function () {
        var apiXSMN = hostApi + '/api/xsmn?limit=1';
        $.ajax({
            url: apiXSMN,
            type: 'GET',
            dataType: 'json',
            //data: dataPost,
            success: function (response) {
                if(response.length > 0){
                    // Chuyển đổi thành mảng các đối tượng JSON từ trường Value
                    const dataArray = response.map(record => JSON.parse(record.Value));

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
                            </div>   
                        </section>     
                    `).join("");
            
                    // Đưa nội dung vào thẻ div
                    $(".content-left").append(htmlContent);
                }
                else {
                    // Không có dữ liệu từ API
                    console.warn("Không có dữ liệu từ API");
                    $("#loading-section").find("h1").text("Không có dữ liệu để hiển thị");
                }
            },
            error: function (response) {
                console.error("Lỗi khi gọi API:", response);
                $("#loading-section").find("h1").text("Lỗi khi tải dữ liệu. Vui lòng thử lại sau");
            }
          });
    }

    that.GetXSMT = function () {
        var apiXSMT = hostApi + '/api/xsmt?limit=1';
        $.ajax({
            url: apiXSMT,
            type: 'GET',
            dataType: 'json',
            //data: dataPost,
            success: function (response) {
                if(response.length > 0){
                    // Chuyển đổi thành mảng các đối tượng JSON từ trường Value
                    const dataArray = response.map(record => JSON.parse(record.Value));

                    let htmlContent = dataArray.map(data => `
                        <section class="section" id="${data.loai}_kqngay_${data.code}"> 
                            <header class="section-header">
                                <h1>XSMT - Kết quả xổ số Miền Trung - XSMT ${that.getDisplayText(data.date)}</h1>
                                <h2 class="site-link">
                                    <a title="XSMT" href="/xo-so-mien-trung/xsmt-p1.html">XSMT</a>
                                    <a title="XSMT ${data.date}" href="/xsmt-${data.code}.html">XSMT ${data.date}</a> 
                                </h2>
                            </header>
                
                            <div class="section-content" id="${data.loai}_kqngay_${data.code}">
                                <table class="table-result table-xsmt">
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
                            </div>   
                        </section>     
                    `).join("");
            
                    // Đưa nội dung vào thẻ div
                    $(".content-left").append(htmlContent);
                }
                else {
                    // Không có dữ liệu từ API
                    console.warn("Không có dữ liệu từ API");
                    $("#loading-section").find("h1").text("Không có dữ liệu để hiển thị");
                }
            },
            error: function (response) {
                console.error("Lỗi khi gọi API:", response);
                $("#loading-section").find("h1").text("Lỗi khi tải dữ liệu. Vui lòng thử lại sau");
            }
          });
    }

    that.GetXSMB = function (){
        $.ajax({
            url: hostApi + '/api/xsmb?limit=1',
            type: 'GET',
            dataType: 'json',
            //data: dataPost,
            success: function (response) {
                if (response.length > 0) {
                    // Chuyển đổi thành mảng các đối tượng JSON từ trường Value
                    const dataList = response.map(record => JSON.parse(record.Value));
        
                    // Hàm tạo tiêu đề
                    const createHeader = (data) => `
                        <header class="section-header">
                            <h1>${data.region} - Kết quả xổ số ${data.location} - SXMB ${data.date}</h1>
                            <div class="site-link">
                                <a title="XSMB" href="/xo-so-${data.region.toLowerCase()}/${data.region.toLowerCase()}-p1.html">${data.region}</a>
                                <a title="${data.region} ${data.date}" href="/${data.region.toLowerCase()}-${data.date.replace(/\//g, '-')}.html">${data.region} ${data.date}</a>
                            </div>
                        </header>
                    `;
        
                    // Hàm tạo bảng kết quả xổ số
                    const createTable = (data) => `
                        <table class="table-result">
                            <tbody>
                                <tr>
                                    <th class="name-prize"></th>
                                    <td class="number-prize">
                                        ${data.codes.map(code => `<span class="code-DB8">${code}</span>`).join(' ')}
                                    </td>
                                </tr>
                                ${["ĐB", "1", "2", "3", "4", "5", "6", "7"].map(rank => `
                                    <tr>
                                        <td>${rank}</td>
                                        <td>
                                            ${data.prizes[rank]?.map(prize => `
                                                <span class="${rank === "ĐB" ? "special-prize" : `prize${rank}`}">${prize}</span>
                                            `).join(' ') || ""}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `;
        
                    // Hàm tạo section
                    const createSection = (data) => `
                        <section class="section" id="kqngay_${data.date.replace(/\//g, '')}">
                            ${createHeader(data)}
                            <div class="section-content">
                                ${createTable(data)}
                            </div>
                        </section>
                    `;
        
                    // Tạo nội dung HTML
                    const htmlContent = dataList.map(createSection).join('');
                    $(".content-left").html(htmlContent);
                } else {
                    console.warn("Không có dữ liệu từ API");
                    $("#loading-section").find("h1").text("Không có dữ liệu để hiển thị");
                }
            },
            error: function (response) {
                console.error("Lỗi khi gọi API:", response);
                $("#loading-section").find("h1").text("Lỗi khi tải dữ liệu. Vui lòng thử lại sau");
            }
          });
    }

    // Hàm gọi API song song và xử lý kết quả
    that.loadAllData = function () {
        Promise.all([that.GetXSMN(), that.GetXSMT(), that.GetXSMB()])
            .then(function () {
                //console.log("Tất cả dữ liệu đã được tải xong");
            })
            .catch(function (error) {
                console.error("Có lỗi khi tải dữ liệu:", error);
            });
    };

    that.init();
}

jQuery(function () { xoso_index = new Index(); });