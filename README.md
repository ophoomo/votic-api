<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## VoticApp

- ชื่อโครงงาน โปรแกรมช่วยในการตัดสินใจของนักศึกษา
- รายชื่อสมาชิก
  *6306021621073 นายธนภูมิ อุ่นจิตร Sec 2
   6306021621111 นายชญานิน ชากลาง Sec 2
   6306021621120 นายศรัณย์ชัย ศิริวงศ์ตระกูล Sec 2

- อธิบายการทำงานของโครงงาน 

เป็นโครงงานเกี่ยวกับการช่วยตัดสินใจของนักศึกษาภายในห้องเรียน
เนื่องจากปัญหาโควิด ทำให้นักศึกษาไม่สามารถพบเจอกันได้และเมื่อมีเรื่องที่ต้องตัดสินใจอะไรสักอย่างร่วมกัน นักศึกษาไม่ค่อยมีเครื่องมือเฉพาะทางการช่วยตัดสินใจ
เราได้เห็นปัญหาตรงจุดนี้ เราจึงจะพัฒนาเครื่องมือที่มีไว้สำหรับการโหวตและช่วยในการตัดสินใจของนักศึกษาภายในห้องเรียน หรือ ภายในกลุ่ม
โดยวิธีการใช้งาน นักศึกษาสามารถสมัครสมาชิก เข้าสู่ระบบไป สร้างห้อง หรือ กลุ่มของตนเอง และ นำโค้ด ไปให้เพื่อนเพื่อเข้ากลุ่ม หลังจากเข้ากลุ่มกันเสร็จแล้ว นักศึกษคนใดก็ได้สามารถสร้างหัวข้อขึ้นมา 
หลังจากสร้างเสร็จ มันก็จะมีหัวข้อนั้นเด้งขึ้นมาให้โหวต หลังจากโหวตเสร็จ หรือ หมดเวลา ระบบจะทำการสรุปผลให้

โปรแกรมมีความสามารถดังนี้
1.สมัครสมาชิก
2.เข้าสู่ระบบ
3.สร้างกลุ่ม
4.เข้าร่วมกลุ่ม
5.เปิดหัวข้อโหวต และกำหนดเวลาปิดได้ ภายในกลุ่ม
6.สามารถโหวตได้
7.ดูสรุปผลโหวตได้
8.ดูรายชื่อคนที่โหวต

มีประโยชน์ดังนี้
ช่วยให้นักศึกษาตัดสินใจอะไรได้รวดเร็วยิ่งขึ้น และสะดวกสบายมากยิ่งขึ้น

- เครื่องมือที่ใช้
Front-end: nextjs
Back-end: nestjs
Database: mongodb