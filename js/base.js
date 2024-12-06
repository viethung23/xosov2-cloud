var xoso_base;

Base = function() {
    var that = this;
    var hostApi = 'https://apixosov2.viethungdev23.workers.dev';

    that.init = function() {
        that.GetXSMN();
        that.OnclickAi();
    };

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

    that.GetXSMN = function () {
        const fullPath = $(location).attr('pathname');
        if(fullPath == '/xo-so-mien-nam/xsmn-p1'){
            hostApi = hostApi + '/api/sxmn';
        }
        else {
            hostApi = hostApi + '/api/sxmt';
        }

        // Hiển thị giao diện skeleton ngay lập tức
        const skeletonHtml = `
            <section class="section" id="loading-section">
                <header class="section-header">
                    <h1>Đang tải dữ liệu xổ số...</h1>
                </header>
                <div class="section-content">
                    <table class="table-result table-xsmn">
                        <thead>
                            <tr>
                                <th class="name-prize">Giải</th>
                                <th class="prize-col3"><h3>Loading...</h3></th>
                                <th class="prize-col3"><h3>Loading...</h3></th>
                                <th class="prize-col3"><h3>Loading...</h3></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${[...Array(9)].map(() => `
                                <tr>
                                    <th>Loading...</th>
                                    <td><span class="xs_prize placeholder"></span></td>
                                    <td><span class="xs_prize placeholder"></span></td>
                                    <td><span class="xs_prize placeholder"></span></td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </section>
        `;
        $(".content-left").html(skeletonHtml); // Hiển thị skeleton ngay lập tức


        $.ajax({
            url: hostApi,
            type: 'GET',
            dataType: 'json',
            //data: dataPost,
            success: function (response) {
                console.log(response)
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

    that.init();
}

jQuery(function () { xoso_base = new Base(); });