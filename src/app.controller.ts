import { Body, Controller, Get, Param, Post, Render } from '@nestjs/common';
import { AppService } from './app.service';
import * as mysql from 'mysql2';
import { UjGyerekDto } from './ujgyerekDTO';
const conn = mysql
  .createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'teszt_mikulas',
  })
  .promise();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  index() {
    return { message: 'Kezdőlap' };
  }

  @Get('/gyerekek')
  @Render('gyerekek')
  async gyerekek() {
    /*const eredmenyek = await conn.execute('SELECT id, nev FROM gyerekek');
    console.log(eredmenyek[0]);
    console.log(eredmenyek[1]);*/

    const [adatok, mezok] = await conn.execute('SELECT id, nev FROM gyerekek');
    return { title: 'Gyerekek Lista', gyerekek: adatok };
  }
  @Get('/gyerekek/:id')
  @Render('gyerek')
  async egyGyerek(@Param('id') id: number) {
    const [adatok] = await conn.execute('SELECT * FROM gyerekek WHERE id = ?', [
      id,
    ]);
    return adatok[0];
  }
  @Get('ujgyerek')
  @Render('ujgyerek')
  ujgyerek() {
    return { title: 'Új gyerek felvétele' };
  }
  @Post('/ujGyerek')
  async ujGyerek(@Body() ujGyerek: UjGyerekDto){
    const nev = ujGyerek.nev;
    const jo: boolean = ujGyerek.jo == '1';
    const ajandek = jo ? ujGyerek.ajandek : null;
    const [adatok] = await conn.execute(
      'INSERT INTO gyerekek (nev,jo,ajandek) VALUES (?,?,?)',
      [nev, jo, ajandek],
    );
    console.log(adatok);
    return {};
  }
}
