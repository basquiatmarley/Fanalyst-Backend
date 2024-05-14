// DataTablesService.ts
import ApiService from "@/core/services/ApiService";

class DataTablesService {
  static saveParamsToStorage(params: any,searchValue : any = ''): void {
    const URL_PATH = window.location.pathname;;
    localStorage.setItem(`dataTablesParams${URL_PATH}`, JSON.stringify(params));
    localStorage.setItem(`dataTablesParams${URL_PATH}-searchvalue`, searchValue);
  }

  static loadParamsFromStorage(): any {
    const URL_PATH = window.location.pathname;;
    const storedParams = localStorage.getItem(`dataTablesParams${URL_PATH}`);
    return storedParams ? JSON.parse(storedParams) : null; // Load params from localStorage
  }

  static loadSearchValue(): any {
    const URL_PATH = window.location.pathname;;
    const storedParams = localStorage.getItem(`dataTablesParams${URL_PATH}-searchvalue`);
    return storedParams ? storedParams : ''; // Load params from localStorage
  }
  static async fetchDatax(url: string, params: any): Promise<any> {
    try {
      ApiService.setHeader();
      const response = await ApiService.query(url,  {
        params: { filter: params },
      });
      return { data: response.data, params }; 
    } catch (error) {
      console.error("Error fetching data:", error);
      return { data: [], params };
    }
  }

  static async handleSort(sLabel: any,params:any, fetchData: Function): Promise<void> {
    let label = sLabel.label;
    if (label) {
      label = label.replace(/_/g, " ");
      params.order = [`${label} ${sLabel.order}`];
      await fetchData();
    }
  }

  static reverseSort(sortParams : any){
    if(sortParams[0] != undefined){
      var sortParamsSplit = sortParams[0].split(" ");
      if(sortParamsSplit.length == 2){
        return [sortParamsSplit[0],sortParamsSplit[1]];
      }else if(sortParamsSplit.length == 3){
        return [`${sortParamsSplit[0]}_${sortParamsSplit[1]}`,sortParamsSplit[2]];
      }else{
        return null;
      }
    }
    return null;
  }

  static async changeRowsPerPageLimit(num: number, params: any, fetchData: Function): Promise<void> {
    params.limit = num;
    params.offset = 0;
    await fetchData();
  }

  static async changePage(num: number, params: any, fetchData: Function): Promise<void> {
    params.offset = (num - 1) * params.limit;
    await fetchData();
  }

  static async filterData(params: any,paramsQuery :any, fetchData: Function): Promise<void> {
    params.where = paramsQuery;
    params.offset = 0;
    await fetchData();
  }
}

export default DataTablesService;