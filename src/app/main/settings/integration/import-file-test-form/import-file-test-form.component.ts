import { Component, Input } from '@angular/core';
import { FileMapAndValidateResult } from '../types';
import { Ams } from 'src/app/amsconfig';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-import-file-test-form',
  templateUrl: './import-file-test-form.component.html',
  styleUrls: ['./import-file-test-form.component.scss'],
})
export class ImportFileTestFormComponent {
  availableParsers = ['AmsBundleFileParser', 'AmsOrdinFileParser', 'BeckFileParser'];
  selectedParser: string;
  messages: string[] = [];
  testResult: FileMapAndValidateResult;

  constructor(private http: HttpClient) {}

  doTest(parser: string, file: File) {
    let payload = new FormData();
    payload.append('file', file);
    payload.append('fileParserName', parser);

    return this.http.post<FileMapAndValidateResult>(
      `${Ams.Config.BASE_URL}/_api/integration/testImportFile`,
      payload
    );
  }

  onTest() {
    const importTestFile = document.getElementById('input-file-id') as HTMLInputElement;
    if (importTestFile.files.length === 0) {
      this.messages = ['No import file selected'];
      return;
    }

    if (!this.selectedParser) {
      this.messages = ['Choose an import file type'];
      return;
    }

    this.messages = ['Testing...'];

    this.testResult = null;
    this.doTest(this.selectedParser, importTestFile.files[0]).subscribe({
      next: (result) => {
        this.messages = ['Test result complete'];
        this.testResult = result;
      },
      error: (ex) => {
        this.messages = ex.error.errors;
      },
    });
  }

  trackByKey = (index: number): any => {
    return index;
  };
}
