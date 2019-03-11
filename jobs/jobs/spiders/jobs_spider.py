


import scrapy
from scrapy.xlib.pydispatch import dispatcher
from scrapy import signals
import re

lang_dict = {'Python': 0, 'Java': 0, 'Javascript': 0, 'Php': 0, 'Go': 0, 'Perl': 0, 'Rust': 0, 'Ruby': 0, 'Bash': 0, 'erlang': 0, 'HTML': 0, 'CSS': 0}
lang_exceptions_dict = {'C': 0, 'C++' : 0, 'C#': 0}

def dict_update(strin):
	for lang in lang_dict:
		reg = re.compile(r'\b(?:%s+)\b' % lang , re.M|re.I)
		if reg.search(strin):
			lang_dict[lang] += 1
			
	#C++ and C# need a special case because of the pluses
	#it's ok to lose the \b because there aren't any words that contain 'C++' (unlike 'Go' or 'C')
	reg = re.compile(r'(?:%s+)' % 'c\+\+', re.M|re.I)
	if(reg.search(strin)):
		lang_exceptions_dict['C++'] += 1
	reg = re.compile(r'(?:%s+)' % 'c\#', re.M|re.I)
	if(reg.search(strin)):
		lang_exceptions_dict['C#'] += 1

	#C also needs a special case to prevent it from being matched with C++ and C#
	reg = re.compile(r'\bc(?!%s)(?!%s)\b' % ('\+\+', '\#'), re.M|re.I)
	if reg.search(strin):
		lang_exceptions_dict['C'] += 1

def dict_print():
	for k,v  in lang_dict.items():
		if v != 0:
			print(k + ": " + str(v))
	for k,v  in lang_exceptions_dict.items():
		if v != 0:
			print(k + ": " + str(v))


def dict_fprint():
	with open("results.txt", 'w') as f:
		f.write("am scris ceva in fisier")
		for k,v  in lang_dict.items():
			if v != 0:
				f.write(k + ": " + str(v))
		for k,v  in lang_exceptions_dict.items():
			if v != 0:
				f.write(k + ": " + str(v))




class JobsSpider(scrapy.Spider):
		name = "jobs"

		def __init__(self):
			dispatcher.connect(self.spider_closed, signals.spider_closed)

		def start_requests(self):
			url = "https://www.ejobs.ro/locuri-de-munca/it-software/"

			yield scrapy.Request(url = url, callback = self.parse)

		def parse(self, response):	#page parse
			page = response.url.split("/")[-2]
			filename = 'jobs-%s.html' % page
			links = response.xpath('//a[re:test(@class, "title dataLayerItemLink")]//@href').getall()
			

			for link in links:
				yield scrapy.Request(link, callback = self.parse2)

			next_page = response.xpath('//link[@rel="next"]/@href').get()
			if next_page is not None:
				next_page = response.urljoin(next_page)
				yield scrapy.Request(next_page, callback = self.parse)
			
			dict_fprint()

		def parse2(self, response):	#link parse
			title = response.css('title').get()
			cand_ideal = response.xpath('//div[@class="jobad-content-block"]')[0].get()
			descr_job = response.xpath('//div[@class="jobad-content-block"]')[1].get()
			
			dict_update(title + cand_ideal + descr_job)

		def spider_closed(self, spider):
			dict_print()	
			
