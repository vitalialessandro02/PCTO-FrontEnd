import { Component, OnInit } from '@angular/core';
import { ScuoleService } from '../../service/scuole.service';
import { Scuola } from '../../interface/scuola';
import { Universi } from '../../interface/universi';
import { UniversiService } from '../../service/universi.service';
import { Res } from '../../interface/res';
import { ResService } from '../../service/res.service';
import { ResattService } from 'src/app/service/resatt.service';
import { Risatt } from 'src/app/interface/risatt';
import { Anni } from 'src/app/interface/anni';
import { ProfessoriService } from 'src/app/service/professori.service';
import { Professori } from 'src/app/interface/professori';
import { Profvisual } from 'src/app/interface/profvisual';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, toArray } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
})
export class StatsComponent implements OnInit {
  
  constructor(private http: HttpClient,
    private scuolaService: ScuoleService,
    private universiService: UniversiService,
    private resService: ResService,
    private resatService: ResattService,
    private professoriService: ProfessoriService
  ) {}


  public scuole: Scuola[] =[];
  public universi: Universi[] | undefined;
  public risultati: Res[] = [];
  public risatt: Risatt[] = [];
  public anni: Anni[] = [];
  public prof: Professori[] = [];
  public profVisual : Profvisual[] =[]
  public click = 0;
  public anno = 0;
  public annoVisual = '';
  public visualRis: Res[] = [];
  public visualRisAtt: Risatt[] = [];
  
  public ordinamenti = 'ISCRITTI';
  public ordinamentiAtt = 'ISCRITTI';
  public ordinamentiProf='ISCRITTI';
  ngOnInit(): void {
    this.getRes();
    this.getResatt();
    this.getScuole();
    this.getUniversi();
    //this.getProfessori();
  }

  getProfessori(): void {
    this.professoriService.getProfessori().subscribe({
      next: (response) => (this.prof = response),
      complete: () => {
        this.createProfVisual()
        },
      error: (error) => console.log(error),
    });
  }

  createProfVisual(){
    if(this.prof.length>0){
      this.prof.forEach(p=>{
        let nome = p.nome.toUpperCase();
        let cognome = p.cognome.toUpperCase();
        let id = p.email
        let prof = {email:p.email,nome: nome,cognome:cognome,scuolaImp:p.scuolaImp,attivita:p.attivita}
        this.scuole.forEach(s=>{
          if(s.idScuola== prof.scuolaImp){
            let provis:Profvisual = {professore : prof,scuola :s}
            this.profVisual.push(provis)
          }
        })
      })
    }
  }

  getScuole(): void {
    this.scuolaService.getScuole().subscribe({
      next: (response) => (this.scuole = response),
      complete: () => this.getProfessori(),
      error: (error) => console.log(error),
    });
  }

  getUniversi(): void {
    this.universiService.getUniversi().subscribe({
      next: (reponse) => (this.universi = reponse),
      error: (error) => console.log(error),
    });
  }

  getRes(): void {
    this.resService.getRes().subscribe({
      next: (response) => (this.risultati = response),
      complete: () => {
        this.anno = this.risultati[this.risultati.length - 1].annoAcc;
        this.creaAnnoVisual(this.anno);
        this.createAnni(this.risultati[0].annoAcc, this.anno);
        this.setRisultati();
        this.ordina();
        this.getResatt();
      },
      error: (error) => console.log(error),
    });
  }

  creaAnnoVisual(a: number) {
    let ain = (a / 2 - 1).toFixed().substring(2, 4);
    let afin = (a / 2).toFixed().substring(2, 4);
    this.annoVisual = ain + '/' + afin;
  }
  setRisultati() {
    this.risultati.forEach((r) => {
      if (r.annoAcc == this.anno) {
        this.visualRis.push(r);
      }
    });
  }

  setRisultatiAtt() {
    this.risatt.forEach((r) => {
      if (r.annoAcc == this.anno) {
        this.visualRisAtt.push(r);
      }
    });
  }

  getResatt(): void {
    this.resatService.getRes().subscribe({
      next: (response) => (this.risatt = response),
      complete: () => {
        this.anno = this.risultati[this.risultati.length - 1].annoAcc;
        this.setRisultatiAtt();
        this.cambioOrdinamentoAtt('ISCRITTI');
      },
      error: (error) => console.log(error),
    });
  }

  cambioRisultati(e: any) {
    this.creaAnnoVisual(e);
    while (this.visualRis.length > 0) {
      this.visualRis.pop();
    }
    this.risultati.forEach((r) => {
      if (r.annoAcc == e) {
        this.visualRis.push(r);
      }
    });
    this.ordina();
    while (this.visualRisAtt.length > 0) {
      this.visualRisAtt.pop();
    }

    console.log(this.ordinamentiAtt)
    this.risatt.forEach((r) => {
      if (r.annoAcc == e) {
        this.visualRisAtt.push(r);
      }
    });
    this.cambioOrdinamentoAtt(this.ordinamentiAtt)
  }

  createAnni(i: number, f: number) {
    let x = i;
    /*while (x <= f) {
      let anno = (x / 2 - 1).toFixed().substring(2, 4);
      let annofin = (x / 2).toFixed().substring(2, 4);
      let ann: Anni = { value: x, viewValue: anno + '/' + annofin };
      this.anni.push(ann);
      x = x + 2;
    }*/
    let ann: Anni = { value: 4043, viewValue: 21 + '/' + 22 };
    this.anni.push(ann);
    let ann1: Anni = { value: 4045, viewValue: 22 + '/' + 23 };
    this.anni.push(ann1);
    let ann2: Anni = { value: 4047, viewValue: 23 + '/' + 24 };
    this.anni.push(ann2);
    let ann3: Anni = { value: 4049, viewValue: 24 + '/' + 25 };
    this.anni.push(ann3);
  }

  onClick1() {
    this.click = 1;
  }
  onClick2() {
    this.click = 2;
  }
  onClick3() {
    this.click = 3;
  }
  onClick4() {
    this.click = 4;
  }

  cambioOrdinamento(e: any) {
    this.ordinamenti = e;
    this.ordina();
  }

  ordina() {
    if (this.visualRis.length > 0) {
      switch (this.ordinamenti) {
        case 'ISCRITTI':
          this.visualRis.sort((a, b) => b.iscritti.length - a.iscritti.length);
          break;
        case 'REGIONI':
          this.visualRis.sort((a, b) =>
            a.scuola.regione.localeCompare(b.scuola.regione)
          );
          break;
        case 'SCUOLE':
          this.visualRis.sort((a, b) =>
            a.scuola.nome.localeCompare(b.scuola.nome)
          );
          break;
        default:
          break;
      }
    }
  }
  cambioOrdinamentoAtt(e: any) {
    this.ordinamentiAtt=e
    switch (this.ordinamentiAtt) {
      case 'ISCRITTI':
        this.visualRisAtt.sort(
          (a, b) => b.universitarii.length - a.universitarii.length
        );
        break;
      case 'NOME':
        this.visualRisAtt.sort((a, b) => a.attivita.localeCompare(b.attivita));
        break;
      default:
        break;
    }
  }
  cambioOrdinamentoProf(e: any) {
    this.ordinamentiProf=e
    switch (this.ordinamentiProf) {
      case 'COGNOME':
        this.profVisual.sort(
          (a, b) =>a.professore.cognome.localeCompare(b.professore.cognome)
        );
        break;
      case 'NOME':
        this.profVisual.sort((a, b) => a.professore.nome.localeCompare(b.professore.nome));
        break;
      default:
        break;
    }
  }
 
 // Metodo per avviare il download del file
 scaricaVistaProfessori():void  {
  this.downloadProfFile().subscribe(
    (blob: Blob) => {
      // Creare un oggetto URL per il blob scaricato
      const url = window.URL.createObjectURL(blob);

      // Creare un link temporaneo e avviare il download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'professori.xlsx'; 
      document.body.appendChild(link);
      link.click();

      // Pulire l'URL creato per il blob
      window.URL.revokeObjectURL(url);
    },
    (error) => {
      console.error('Errore durante il download del file:', error);
    }
  );
}
downloadProfFile(): Observable<Blob> {
  const url = 'http://localhost:8080/professori/download';
  let body = {name:"professori.xlsx" };
  console.log(body.name);
  // Effettua una richiesta HTTP GET per scaricare il file
 // Effettua una richiesta HTTP POST per scaricare il file
 return this.http.post<Blob>(url, body, {
  responseType: 'blob' as 'json', // Indica al server che ci aspettiamo un blob come risposta
});


 


}


// Metodo per avviare il download del file
scaricaVistaScuole():void  {
  this.downloadScuoleFile().subscribe(
    (blob: Blob) => {
      // Creare un oggetto URL per il blob scaricato
      const url = window.URL.createObjectURL(blob);

      // Creare un link temporaneo e avviare il download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'scuole.xlsx'; 
      document.body.appendChild(link);
      link.click();

      // Pulire l'URL creato per il blob
      window.URL.revokeObjectURL(url);
    },
    (error) => {
      console.error('Errore durante il download del file:', error);
    }
  );
}
downloadScuoleFile(): Observable<Blob> {
  
  const url = 'http://localhost:8080/scuola/download';
  let body = {name:"scuole.xlsx" };
  console.log(body.name);
  // Effettua una richiesta HTTP GET per scaricare il file
 // Effettua una richiesta HTTP POST per scaricare il file
 return this.http.post<Blob>(url, body, {
  responseType: 'blob' as 'json', // Indica al server che ci aspettiamo un blob come risposta
});

}

// Metodo per avviare il download del file
scaricaVistarisulati():void  {
  this.downloadRisFile().subscribe(
    (blob: Blob) => {
      // Creare un oggetto URL per il blob scaricato
      const url = window.URL.createObjectURL(blob);

      // Creare un link temporaneo e avviare il download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'risultati.xlsx'; 
      document.body.appendChild(link);
      link.click();

      // Pulire l'URL creato per il blob
      window.URL.revokeObjectURL(url);
    },
    (error) => {
      console.error('Errore durante il download del file:', error);
    }
  );
}
downloadRisFile(): Observable<Blob> {

  const url = 'http://localhost:8080/risultati/download';
  let body = {name:"risultati.xlsx" };
  console.log(body.name);
  // Effettua una richiesta HTTP GET per scaricare il file
 // Effettua una richiesta HTTP POST per scaricare il file
 return this.http.post<Blob>(url, body, {
  responseType: 'blob' as 'json', // Indica al server che ci aspettiamo un blob come risposta
});
}
  
}
