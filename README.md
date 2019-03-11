# IT-jobs-stats

A Python web crawler built using Scrapy. Working on it I've learned a lot about regular expressions, working with a big framework and overall Python practice. 

It works by following a link to a job openings site (https://www.ejobs.ro/locuri-de-munca/it-software/) and then going through every link of every page to analyse the relevant text using regular expressions. 

To run (on Linux): have scrapy installed, cd to the jobs directory and run the command: 'scrapy crawl jobs'

Result:


TODO:

   - make it work for databases, frameworks and technologies 
    
   - make it city specific
    
   - maybe have it visist multiple sites (though I'd have to watch for duplicate postings)
    
   - build a pretty interface using matplotlib and django and host it somewhere
