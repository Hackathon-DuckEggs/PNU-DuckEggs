const axios = require('axios')

async function getAutocomplete(title) {
	title = title.toUpperCase().replace(/(\s*)/g,'')

	let data = {
		size: 20,
		query: {
			function_score: {
				query: {
					bool: {
						must: [{
								match: {
									"title.ngram": {
										query: title,
										analyzer: "title_query_analyzer"
									}
								}
							}]
					}
				}
			}
		}
	}

	const maxScore = (await axios.get('http://duckegg_elasticsearch_1:9200/auto_complete/_search?pretty', { data })).data.hits.max_score

	data['query']['function_score']['functions'] = [{
		script_score: {
			script: {
				source: `_score < ${maxScore * 2 / 3} ? 0 : doc['reviewCnt'].value`,
				lang: "painless"
			}
		}
	}]

	data['query']['function_score']["score_mode"] = "sum"
	data['query']['function_score']["boost_mode"] = "replace"
	data["highlight"] = {
		fields: {
			"title.ngram" : {}
		}
	}

	const result = (await axios.get('http://duckegg_elasticsearch_1:9200/auto_complete/_search?pretty', { data })).data.hits.hits.map((value) => Number.parseInt(value._id))
	return result
}

module.exports = { getAutocomplete }