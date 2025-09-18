// prettier-ignore-file

[Client] (ReactJS / Mobile)
    |
    v
[NestJS API Gateway]
    |
    |--- (1) Kiểm tra cache (Redis)
    |         |
    |         |--- Có dữ liệu? → Trả về client ngay (Cache Hit)
    |         |
    |         |--- Không có dữ liệu? (Cache Miss)
    v
[Database] (PostgreSQL / MySQL / Oracle / Mongo)
    |
    |--- (2) Truy vấn DB lấy dữ liệu
    v
[NestJS Service]
    |
    |--- (3) Lưu dữ liệu vào Redis với TTL (ví dụ 60s)
    v
[Client] nhận dữ liệu
