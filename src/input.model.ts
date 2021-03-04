import {RequestModel} from './request/request.model';

export interface InputModel {
  content: RequestModel;
  errorCallback: RequestModel;
  successCallback?: RequestModel | undefined;
}
