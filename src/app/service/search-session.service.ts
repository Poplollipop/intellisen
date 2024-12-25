import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SearchSessionService {

   private inputData: InputSearchData = {
    keyword: '',
    inputCase: '',
    inputLaw:'',
    inputCourts: [],
    inputCaseYear: '',
    lawType:'',
    startDate: new Date('1990-01-01') ,
    endDate: new Date('9990-01-01'),
    caseType: '',
  }

  setData(data: InputSearchData): void {
      this.inputData = { ...data };
    }

  // 清除選擇條件
  clearData(): void {
    this.inputData = {
      keyword: '',
      inputCase: '',
      inputLaw:'',
      inputCourts: [],
      inputCaseYear: '',
      lawType: '',
      startDate: new Date('1990-01-01') ,
      endDate: new Date('9990-01-01'),
      caseType: '',
    };
  }

}

export interface InputSearchData{
  keyword: string;
  inputCase: string;
  inputLaw: string;
  inputCourts: string[];
  inputCaseYear: string;
  lawType: string;
  startDate: Date;
  endDate: Date;
  caseType: string;
}
