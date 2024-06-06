import { Injectable } from '@angular/core';
export const LOCATIONS : string = "locations";

@Injectable()
export class LocationService {

  constructor() {
  }

  getLocations():string[]{
    let locString = localStorage.getItem(LOCATIONS);
    if (locString)
      {
        const locations =JSON.parse(locString); 
        console.log(locations);
        return  locations.filter(l => l!==null);
      }
      return []
  }

  addLocation(zipcode : string)
  {
    const locations = [...this.getLocations(),zipcode]
    console.log(locations);
    localStorage.setItem(LOCATIONS, JSON.stringify(locations));
  }

  removeLocation(zipcode : string) {
    let locations =this.getLocations();
    let index = locations.indexOf(zipcode);
    if (index !== -1){
      locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(locations));
    }
  }
}
