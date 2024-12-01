//Type.registerNamespace("Xoso");
var xsmb;

XSMB = function() {
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

        that.GetXSMB();
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

    // that.GetXSMB = function () {
    //     // Dữ liệu JSON
    //     const data = {
    //         region: "XSMB",
    //         date: "30/11/2024",
    //         location: "Nam Định",
    //         codes: ["1XP", "4XP", "6XP", "7XP", "10XP", "12XP", "18XP", "19XP"],
    //         prizes: {
    //             "ĐB": ["93376"],
    //             "1": ["06046"],
    //             "2": ["42955", "75105"],
    //             "3": ["17444", "75107", "11181", "82857", "12111", "25156"],
    //             "4": ["3216", "1512", "4084", "6804"],
    //             "5": ["8926", "8819", "7427", "5478", "8671", "6023"],
    //             "6": ["990", "523", "985"],
    //             "7": ["04", "53", "96", "93"]
    //         }
    //     };
    
    //     // Tạo nội dung HTML
    //     let htmlContent = `
    //         <section class="section" id="kqngay_${data.date.replace(/\//g, '')}">
    //             <header class="section-header">
    //                 <h1>${data.region} - Kết quả Xổ số Miền Bắc - SXMB ${data.date === "30/11/2024" ? "hôm nay" : data.date}</h1>
    //                 <div class="site-link">
    //                     <a title="${data.region}" href="/xo-so-mien-bac/${data.region.toLowerCase()}-p1.html">${data.region}</a>
    //                     <a title="${data.region} Thứ 7" href="/${data.region.toLowerCase()}-thu-7.html">${data.region} Thứ 7</a>
    //                     <a title="${data.region} ${data.date}" href="/${data.region.toLowerCase()}-${data.date.replace(/\//g, '-')}.html">${data.region} ${data.date}</a>
    //                     (${data.location})
    //                 </div>
    //             </header>
    //             <div class="section-content">
                // <table class="table-result">
                //     <tbody>
                //         <tr>
                //             <th class="name-prize"></th>
                //             <td class="number-prize">
                //                 ${data.codes.map(code => `<span class="code-DB8">${code}</span>`).join(' ')}
                //             </td>
                //         </tr>
                //         ${["ĐB", "1", "2", "3", "4", "5", "6", "7"].map(rank => `
                //             <tr>
                //                 <td>${rank}</td>
                //                 <td>
                //                     ${data.prizes[rank].map(prize => `
                //                         <span class="${rank === "ĐB" ? "special-prize" : `prize${rank}`}">${prize}</span>
                //                     `).join(' ')}
                //                 </td>
                //             </tr>
                //         `).join('')}
                //     </tbody>
                // </table>
    //         </div>
    //         </section>
    //     `;
    
    //     // Đưa nội dung vào DOM
    //     $(".content-left").html(htmlContent);
    // };

    that.GetXSMB = function (){
        const dataList = [
            {
                region: "XSMB",
                date: "30/11/2024",
                location: "Nam Định",
                codes: ["1XP", "2XP", "3XP", "4XP", "5XP", "6XP", "7XP", "8XP"],
                prizes: {
                    "ĐB": ["93376"],
                    "1": ["06046"],
                    "2": ["42955", "75105"],
                    "3": ["17444", "75107", "11181", "82857", "12111", "25156"],
                    "4": ["3216", "1512", "4084", "6804"],
                    "5": ["8926", "8819", "7427", "5478", "8671", "6023"],
                    "6": ["990", "523", "985"],
                    "7": ["04", "53", "96", "93"]
                }
            },
            {
                region: "XSMT",
                date: "29/11/2024",
                location: "Đà Nẵng",
                codes: ["1XT", "2XT", "3XT", "4XT", "5XT", "6XT", "7XT", "8XT"],
                prizes: {
                    "ĐB": ["12345"],
                    "1": ["54321"],
                    "2": ["11223", "44556"],
                    "3": ["33445", "66778", "88990", "11234", "55678", "99012"],
                    "4": ["2233", "4455", "6677", "8899"],
                    "5": ["9012", "3456", "7890", "1234", "5678", "9012"],
                    "6": ["234", "567", "890"],
                    "7": ["12", "34", "56", "78"]
                }
            }
        ];
    
        // Duyệt qua danh sách data và tạo HTML
        const htmlContent = dataList.map(data => `
            <section class="section" id="kqngay_${data.date.replace(/\//g, '')}">
                <header class="section-header">
                    <h1>${data.region} - Kết quả xổ số ${data.location} - SX${data.region} ${data.date === "30/11/2024" ? "hôm nay" : data.date}</h1>
                    <div class="site-link">
                        <a title="${data.region}" href="/xo-so-${data.region.toLowerCase()}/${data.region.toLowerCase()}-p1.html">${data.region}</a>
                        <a title="${data.region} ${data.date}" href="/${data.region.toLowerCase()}-${data.date.replace(/\//g, '-')}.html">${data.region} ${data.date}</a>
                    </div>
                </header>
                <div class="section-content">
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
                                        ${data.prizes[rank].map(prize => `
                                            <span class="${rank === "ĐB" ? "special-prize" : `prize${rank}`}">${prize}</span>
                                        `).join(' ')}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </section>
        `).join('');
    
        // Đưa nội dung vào DOM
        $(".content-left").html(htmlContent);
    }

    // luôn luôn gọi hàm init khi khởi tạo new
    that.init();
}

// $(document).ready(function () {
//     xoso_base = new Base();
// });

jQuery(function () { xsmb = new XSMB(); });