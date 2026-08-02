import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
const pdfParse = require('pdf-parse');

@Injectable()
export class CvParserService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    this.genAI = new GoogleGenerativeAI(this.configService.get<string>('GEMINI_API_KEY', 'dev'));
  }

  async parseCv(buffer: Buffer): Promise<any> {
    try {
      const pdfData = await pdfParse(buffer);
      const text = pdfData.text;

      const model = this.genAI.getGenerativeModel({ model: 'gemini-3.1-flash' });
      
      const prompt = `Analiza el siguiente texto extraído de un CV/currículum y devuelve 
un JSON con los siguientes campos:
{
  "nombre_completo": "",
  "correo": "",
  "telefono": "",
  "especialidad": "",
  "pais": "",
  "ciudad": "",
  "experiencia_anios": 0,
  "resumen": "" // máximo 300 caracteres
}
Si no encuentras un campo, déjalo como null. Asegúrate de devolver SOLO un JSON válido, sin formato markdown extra.

Texto del CV:
${text}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Error al parsear el CV con la IA:', error);
      throw new InternalServerErrorException('Error al parsear el CV con la IA');
    }
  }
}
