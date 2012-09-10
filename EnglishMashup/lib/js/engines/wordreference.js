var WordReference = function(baseEngine) {

	var apiKey = '8d994',
		instance = this,
		otherTranslations = ['SecondTranslation', 'ThirdTranslation'];
	
	var getBaseUrl = function() {
		var source = baseEngine.sourceDic,
			target = baseEngine.targetDic;
		return 'http://api.wordreference.com/'+ apiKey +'/json/' + 
					source + target;
	};
	
	this.translateWord = function(word, callback) {
		var url = getBaseUrl() + "/" + word; 
		$.getJSON(url, function(data){
			var markup = [
			      '<table class="wr result table table-bordered table-striped">',
			      	 '<tr><th>English</th><th>Spanish</th></tr>',
			      	  getPrincipalTranslationsMarkup(data['term0']),
			      '</table>'].join('');
			//$('body').append(markup);
			callback(markup);
		});
	};
	
	var getTermMarkup = function(term, language) {
		if (language == 'en') {
			return [
			        '<p class="term">', Utils.speakableMarkup( term['term'] ), '</p>',
			        '<p class="pos">', term['POS'], '</p>',
			        '<p class="sense">', term['sense']?'('+ Utils.speakableMarkup(term['sense'])+')':'', '</p>',
			        '<p class="usage">',  term['usage'], '</p>'
			].join('');
		}
		else {
			return [
			        '<p class="term">', term['term'], '</p>',
			        '<p class="pos">', term['POS'], '</p>',
			        '<p class="sense">', term['sense']?'('+term['sense']+')':'', '</p>',
			        '<p class="usage">',  term['usage'], '</p>'
			].join('');
		}
	};
	
	var getEntryMarkup = function(entry) {
		console.log('Entry', entry);
		var markup = [
		    '<tr>',
			    '<td>',
			    	getTermMarkup(entry['OriginalTerm'], baseEngine.sourceDic),
			    '</td>',
			    '<td>',
			    	getTermMarkup(entry['FirstTranslation'], baseEngine.targetDic),
			    '</td>',
			'</tr>'
		];
		
		$.each(otherTranslations, function(idx){
			var key = this;
			if (entry[key]) {
				console.log(entry[key]);
				markup.push('<tr>');
				markup.push('<td>&nbsp;</td> <td>' + getTermMarkup( entry[key] ) + '</td>');
				markup.push('</tr>');
			}
		});
		
		return markup.join('');        
	};
	
	var getPrincipalTranslationsMarkup = function(section) {
		console.log('Section', section);
		var markup = [];
		var mainTranslations = section['Entries']? section['Entries']: section['PrincipalTranslations'];
		
		$.each(mainTranslations, function(key, value){
			markup.push( getEntryMarkup(value) );
		});
		return markup.join('');
	};
	
	this.theasaurus = function() {
		
	};
	
	this.monolingual = function() {
		
	};
	
};
