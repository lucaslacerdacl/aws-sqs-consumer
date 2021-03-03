import {RequestModel} from './request/request.model';

export class InputModel {
  content!: RequestModel;
  errorCallback!: RequestModel;
  successCallback: RequestModel | undefined;
}
