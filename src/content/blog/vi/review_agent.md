---
title: "Review Agent"
description: "An Agent First, Local First desktop application"
date: 2025-01-11
---
Review Agent là một ứng dụng desktop theo triết lý Agent-First, Local-First, dành cho việc đánh giá mã nguồn (code review) tự động và tập trung vào quyền riêng tư. Ứng dụng tận dụng các mô hình LLM chạy cục bộ (thông qua Ollama) để đảm bảo mã nguồn của bạn không bao giờ rời khỏi máy tính.

## 1. Các tính năng chính
**Đánh giá mã nguồn tự động**: Chủ động phát hiện lỗi, lỗ hổng bảo mật và các vấn đề về chất lượng mã (code smells).
**Ưu tiên quyền riêng tư**: Được hỗ trợ bởi Ollama. Không yêu cầu kết nối internet hoặc cloud API.
**Chuỗi suy luận (Chain-of-Thought)**: Hiển thị quá trình suy luận nội bộ của agent trước khi đưa ra các gợi ý cuối cùng.
**Xử lý hàng loạt**: Quét toàn bộ thư mục hoặc các module dự án trong một phiên làm việc duy nhất.
**Add-ins có thể mở rộng**: Một môi trường sandbox để chạy các script tùy chỉnh và hộp thoại UI.
**Hỗ trợ đa ngôn ngữ**: Tự động phát hiện ngôn ngữ lập trình và áp dụng các bộ quy tắc tương ứng.

## 2. Cách sử dụng
### Cài đặt
Bạn có thể tải các bản phát hành mới nhất của Review Agent tại: [GitHub Releases](https://github.com/hohuuduc/ReviewSource/releases)

### Kiểm tra một tệp đơn lẻ
Dán mã nguồn vào trình chỉnh sửa hoặc sử dụng File > Open để tải một tệp mã nguồn. Agent sẽ tự động nhận diện ngôn ngữ.

### Kiểm tra hàng loạt nhiều tệp
Chọn thư mục: Điều hướng đến Batch > Scan Directory. Hệ thống sẽ quét các tệp tương thích và thêm chúng vào hàng chờ xử lý.

### Sử dụng Add-ins (Plugins)
Hệ thống Add-in cho phép bạn mở rộng tính năng của ứng dụng bằng các tập tin JavaScript.

**Cách tạo plugin:**
1. Tạo một tệp `.js` trong thư mục `.addins`.
2. Định nghĩa cấu trúc plugin như sau:

```javascript
exports.default = {
  metadata: {
    name: "Tên Plugin" // Hiển thị trong menu Plugins
  },
  // Tuỳ chọn 1: Thực thi hành động ngay lập tức
  action: function(api) {
    api.send({
      action: 'setFile',
      data: { content: '// Code mẫu', language: 'javascript' }
    });
  },
  // Tuỳ chọn 2: Tạo hộp thoại UI tùy chỉnh
  createDialog: function(api) {
    const div = document.createElement('div');
    div.innerHTML = '<button id="btn">Click me</button>';
    div.querySelector('#btn').onclick = () => {
      console.log('Mô hình hiện tại:', api.config.model);
    };
    return div;
  }
};
```

**Các API hỗ trợ:**
- `api.send(payload)`: Gửi dữ liệu về trình chỉnh sửa (hỗ trợ `setFile` hoặc `setFiles`).
- `api.config`: Truy cập thông tin cấu hình (host, model, prompt...).

## 3. Cấu hình & Cài đặt
Để tùy chỉnh hành vi của agent, hãy điều hướng đến bảng Settings:

**Cài đặt AI Engine**
| Tính năng | Mô tả |
| :--- | :--- |
| Ollama Endpoint | Đường dẫn URL nơi Ollama đang chạy. |
| Model Selection | Mô hình LLM cụ thể được sử dụng để suy luận. |

**Quản lý bộ quy tắc (Rules)**
Bạn có thể định nghĩa các quy tắc JSON tùy chỉnh trong thư mục config/rules.
- **Critical**: Các vấn đề ưu tiên cao (Rò rỉ bảo mật, lỗi gây treo ứng dụng).
- **Warning**: Các quy tắc tối ưu (Quy tắc đặt tên, linting).

## 5. Công nghệ sử dụng
**Runtime**: Neutralinojs (Cầu nối OS gốc)
**Frontend**: Angular (Standalone Components & Signals)
**AI Engine**: Ollama (Local Streaming API)

## 6. Đánh giá hiệu năng (Benchmark)

:::collapse("Cấu hình phần cứng thử nghiệm")

| Thành phần | Thông số kỹ thuật |
| :--- | :--- |
| **CPU** | Xeon E5-2699 (45M cache; 2,30 GHz) |
| **GPU** | NVIDIA Tesla P40 (24GB VRAM) |
| **RAM** | 48GB DDR4 |
| **Hệ điều hành** | Windows 10 |

:::

## 7. Tối ưu hóa
