import { Injectable } from '@angular/core';
import { LogService } from '@alfresco/adf-core';
import { from, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlfrescoApiService } from '@alfresco/adf-content-services';

@Injectable({
  providedIn: 'root'
})
export class VenziaDatalinkApiService {
  constructor(private apiService: AlfrescoApiService, private logService: LogService) {}

  loadDataLink(): Observable<any> {
    return from(this.executeWebScript('GET', 'aqua/datalink/v1/list', null, null, 'service', null)).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  private handleError(error: any) {
    this.logService.error(error);
    return throwError(error || 'Server error');
  }

  private executeWebScript(
    httpMethod: string,
    scriptPath: string,
    scriptArgs?: any,
    contextRoot?: string,
    servicePath?: string,
    postBody?: any
  ): Promise<any> {
    contextRoot = contextRoot || 'alfresco';
    servicePath = servicePath || 'service';
    postBody = postBody || null;

    const allowedMethod: string[] = ['GET', 'POST', 'PUT', 'DELETE'];

    if (!httpMethod || allowedMethod.indexOf(httpMethod) === -1) {
      throw new Error('method allowed value  GET, POST, PUT and DELETE');
    }

    if (!scriptPath) {
      throw new Error('Missing param scriptPath in executeWebScript');
    }

    const contentTypes = ['application/json'];
    const accepts = ['application/json', 'text/html'];
    return this.apiService
      .getInstance()
      .contentClient.callApi(scriptPath, httpMethod, {}, scriptArgs, {}, {}, postBody, contentTypes, accepts, null, contextRoot + '/' + servicePath);
  }
}
