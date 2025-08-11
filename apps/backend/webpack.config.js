const { join } = require('path');

module.exports = {
  entry: './src/main.ts',
  output: {
    path: join(__dirname, 'dist'),
    filename: 'main.js',
  },
  target: 'node',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: 'source-map',
  externals: [
    // Exclude optional microservice dependencies
    '@grpc/grpc-js',
    '@grpc/proto-loader',
    'kafkajs',
    'mqtt',
    'nats',
    'ioredis',
    'amqplib',
    'amqp-connection-manager',
    '@nestjs/platform-socket.io',
  ],
};
