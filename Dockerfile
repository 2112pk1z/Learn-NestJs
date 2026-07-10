# Đổi từ node:22-alpine sang node:22-slim
FROM node:22-slim

# Cài đặt thư mục làm việc bên trong container
WORKDIR /usr/src/app

# Copy 2 file quản lý thư viện vào trước để tận dụng cache của Docker
COPY package*.json ./

# Cài đặt các thư viện (node_modules)
RUN npm install

# Copy toàn bộ mã nguồn còn lại vào container
COPY . .

# Mở cổng 3000 để bên ngoài có thể gọi API
EXPOSE 3000

# Lệnh khởi chạy server ở chế độ dev
CMD ["npm", "run", "start:dev"]