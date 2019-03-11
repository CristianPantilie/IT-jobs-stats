function JobsDataLayer (listName) {
    if (0 < $('.dataLayerList').length) {
        this.items = 40;
        this.items_split_by = 10;
        this.chunks = Math.floor(this.items/this.items_split_by);
        this.listName = listName;
        this.index = [];
        this.banners = [];
        this.jobs = [];
        this.URLs = [];
        this.initJobs();
        this.loadObjects();
        this.registerImpressions();
    }
}

JobsDataLayer.prototype.initJobs = function () {
    var parent = this;
    for (var i = 0; i < parent.chunks; i++) {
        parent.jobs.push([]);
    }
};

JobsDataLayer.prototype.loadObjects = function() {
	var parent = this;
    $('.dataLayerList LI.jobitem, .dataLayerList LI.fitem, .dataLayerList LI.job-list-item, .dataLayerList LI.home-jobs-banner,  .dataLayerList #searchBanner').slice(0, this.items).each(function(i) {
        if ('undefined' !== typeof($(this).data('dlobjtype')) && 'promotion' == $(this).data('dlobjtype')) {
            var obj = $(this).data('dlobj');
            parent.index[i] = parent.banners.push($.extend(obj, {id: $(this).attr('id'), position: i + 1})) - 1;
            parent.URLs[i] = $('A', $(this)).eq(0).attr('href');
            parent.registerBannerClick(i, $('A', $(this)));
        }
        else if ('undefined' !== typeof($(this).data('dlobjtype')) && 'activity' == $(this).data('dlobjtype')) {
            var $chunk = Math.floor(i/parent.items_split_by);
            parent.index[i] = parent.jobs[$chunk].push({
                id: $(this).data('id'),
                name: $(this).data('dlname'),
                price: 0,
                brand: $(this).data('dlcompany'),
                list: parent.listName,
                category: $(this).data('dlindustries'),
                variant: $(this).data('dlcareerlevels'),
                position: i + 1
            }) - 1;
            parent.URLs[i] = $('A', $(this)).eq(0).attr('href');
            parent.registerJobClick(i, $chunk, $('A', $(this)).eq(0));
        }
        else {
            var $chunk = Math.floor(i/parent.items_split_by);
            parent.index[i] = parent.jobs[$chunk].push({
                id: $(this).data('id'),
                name: (0 < $('.dataLayerItemTitle', $(this)).length ? $('.dataLayerItemTitle', $(this)).text() : $('[itemprop="title"]', $(this)).text()),
                price: 0,
                brand: (0 < $('.dataLayerItemCompanyTitle', $(this)).length ? $('.dataLayerItemCompanyTitle', $(this)).text() : (0 < $('[itemprop="hiringOrganization"] .company', $(this)).length ? $('[itemprop="hiringOrganization"] .company', $(this)).text() : $('[itemprop="name"]', $(this)).text())),
                list: parent.listName,
                category: 'undefined' !== typeof $(this).data('dlindustries') ? $(this).data('dlindustries') : null,
                variant: 'undefined' !== typeof $(this).data('dlcareerlevels') ? $(this).data('dlcareerlevels') : null,
                position: i + 1
            }) - 1;
            parent.URLs[i] = ('undefined' !== typeof $('[itemprop="title"] A', $(this)).eq(0).attr('href') ? $('[itemprop="title"] A', $(this)).eq(0).attr('href') : $('.dataLayerItemTitle', $(this)).attr('href'));
            parent.registerJobClick(i, $chunk, $('[itemprop="title"] A, [itemprop="hiringOrganization"].jobitem-logo A, A.dataLayerItemTitle, A.dataLayerItemCompanyLogo', $(this)));
        }
    });
};

JobsDataLayer.prototype.registerImpressions = function() {
	// Banners
	if ('undefined' !== this.banners.length && 0 < this.banners.length) {
		this.bannersImpressions();
	}
    // Jobs
	if ('undefined' !== this.jobs.length && 0 < this.jobs.length) {
		this.jobsImpressions();
	}
};

JobsDataLayer.prototype.bannersImpressions = function(type) {
    dataLayer.push({
        'event': 'promoBanner_1',
        'ecommerce': {
            'promoView': {
                'promotions': this.banners
            }
        }
    });
};

JobsDataLayer.prototype.jobsImpressions = function(type) {
    if (0 < this.jobs.length) {
        var $jobs = this.jobs.length;
        for (var i = 0; i < $jobs; i++) {
            if (0 < this.jobs[i].length) {
                dataLayer.push({
                    'event': 'productImpressions_'+ (i + 1),
                    'ecommerce': {
                        'impressions': this.jobs[i]
                    }
                });
            }
        }
    }
    else if (0 < this.this.jobs[0].length) {
        dataLayer.push({
            'event': 'productImpressions_1',
            'ecommerce': {
                'impressions': this.jobs[0]
            }
        });
    }
};

JobsDataLayer.prototype.registerBannerClick = function(i, a) {
	var parent = this;
	a.off('click').on('click', function (e) {
        e.stopPropagation();
		e.preventDefault();
        dataLayer.push({
            'event': 'promotionClick',
            'ecommerce': {
                'promoClick': {
                    'promotions': [parent.banners[parent.index[i]]]
                }
            },
			'eventCallback': function() {
				window.open(parent.URLs[i]);
			}
        });
        return false;
	});
};

JobsDataLayer.prototype.registerJobClick = function(i, c, a) {
	var parent = this;
	a.off('click').on('click', function (e) {
		e.stopPropagation();
		e.preventDefault();
        dataLayer.push({
            'event': 'productClick',
            'ecommerce': {
            	'click': {
            		'actionField': {'list': parent.listName},
	                'products': [parent.jobs[c][parent.index[i]]]
            	}
            },
			'eventCallback': function() {
				document.location = parent.URLs[i];
			}
        });
        return false;
	});
};
