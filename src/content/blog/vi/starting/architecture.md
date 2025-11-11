---
title: "Kiến trúc dự án"
description: "Chi tiết kiến trúc của blog Astro + Angular."
order: 2
---

## Luồng dữ liệu

Markdown được đặt trong thư mục `src/content/pages`. Khi build, Astro tự động chuyển chúng thành route tĩnh dựa trên slug.

### Đồng bộ navigation

- Bộ điều hướng chính được sinh từ metadata `navGroup` trong từng bài.
- Sidebar bên trái liệt kê toàn bộ trang theo `order` để dễ truy cập.
- Mục "On this page" được dựng từ tiêu đề trong markdown.

## Tích hợp Angular

Angular đảm nhiệm các component tương tác như thanh điều hướng, sidebar, mục lục và hộp thoại cài đặt.
