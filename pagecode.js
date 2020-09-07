
//ID als primary field kunnen gebruiken
export function copyIDToTitleField(item, context){
	let hookContext = context;
	item.title = item._id.toString();
	return item;
}


//Fix for multiple reference veld die niet in dataset beschikbaar is
export function Projects_beforeUpdate(item, context) {
	item.equipment2 = item.equipment;
	return item;
}
export function Projects_beforeInsert(item, context) {
	item.equipment2 = item.equipment;
	return item;
}


//user import
export function members_beforeInsert(item, context) {
	let wachtwoord = "";
	wixUsers.register(item.email, wachtwoord, {
    contactInfo: {
     "firstName": item.naam,
		"picture": item.avatar,
		"emails": [item.email],
		"straat": item.straat,
		"postcode": item.postcode,
		"plaatsnaam": item.plaats,
		"land": item.land,
		"geboortedatum": item.geboortedatum,
		"website": item.website,
		"facebook": item.facebook,
		"twitter": item.twitter,
		"googleplus": item.googleplus,
		"instagram": item.instagram,
        "handtekening": item.signature,
		"lidsinds": item.lidsinds,
		"ipadres": item.ipadres
    }
  })
  .then( (result) => {
    let status = result.status; // "Active"
    let user = result.user;
  } );

	return item;
}


//alleen unieke waardes
function makeUniqueDropDownOptions(dropDownOptions) {
		const result = [{label: "All", value: "All"}];
		const map = new Map();
		for (const item of dropDownOptions) {
			if (!map.has(item.value)) {
				map.set(item.value, true); // set any value to Map
				result.push({
					value: item.value,
					label: item.label
				});
			}
		}
		return result;
	}


//genormaliseerde dropdown met key/value ipv key/key
	function createDropdownFromDataset(dropdownID, datasetID){
		$w(datasetID).getItems(0, 100)
		.then(function (result) {
			let items = result.items;
			let dropdownOptions = [{label: "All", value: "All"}];
			for (var i = 0; i < result.items.length; i++) {
				var a = { label: items[i].title, value: items[i]._id };
				dropdownOptions.push(a);
			}
			
			$w(dropdownID).options = dropdownOptions;
		});	
	}
  
  
  
  //filterchaining:
  export function applyAllFilters(){
	var year = $w('#dropdownyear').value;
	var region = $w('#dropdownregion').value;
	var market = $w('#dropdownmarket').value;
	var equipment = $w('#dropdownequipment').value;
	//console.log("applying filters\nyear: " + year + "\nregion: " + region + "\nmarket: " + market + "\nequipment: " + equipment );

	var allFilters = wixData.filter();
	if(year !== "All" && year !== ""){
		allFilters = allFilters.eq("year", year);
	}
	if(region !== "All" && region !== ""){
		allFilters = allFilters.eq("region", region)
	}
	if(market !== "All" && market !== ""){
		allFilters = allFilters.eq("market", market)
	}
	if(equipment !== "All" && equipment !== ""){
		allFilters = allFilters.contains("equipment2", equipment);
	}
	
	$w('#dynamicDataset').setFilter(allFilters);
}
