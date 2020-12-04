const { Component } = require('inferno');
const classname = require('hexo-component-inferno/lib/util/classname');
const Head = require('./common/head');
const Navbar = require('./common/navbar');
const Widgets = require('./common/widgets');
const Footer = require('./common/footer');
const Scripts = require('./common/scripts');
const Search = require('./common/search');

const responsiveConfig = (config, page) => {
    if (page.layout !== 'post') {
        return config;
    }
    return {
        ...config,
        widgets: config.widgets.filter(widget => widget.type === 'toc' || widget.type === 'profile')
    };
}

module.exports = class extends Component {
    render() {
        const { site, config: originConfig, page, helper, body } = this.props;

        site.posts.forEach(p => {
            if (!p.thumbnail) {
                p.thumbnail = '/img/thumbnail.svg';
            }
        });

        const config = responsiveConfig(originConfig, page);

        const language = page.lang || page.language || config.language;
        const columnCount = Widgets.getColumnCount(config.widgets);

        return <html lang={language ? language.substr(0, 2) : ''}>
            <Head site={site} config={config} helper={helper} page={page} />
            <body class={`is-3-column`}>
                <Navbar config={config} helper={helper} page={page} />
                <section class="section">
                    <div class="container">
                        <div class="columns">
                            <div class={classname({
                                column: true,
                                'order-2': true,
                                'column-main': true,
                                'is-12': columnCount === 1,
                                'is-8-tablet is-8-desktop is-9-widescreen': columnCount === 2,
                                'is-8-tablet is-8-desktop is-6-widescreen': columnCount === 3
                            })} dangerouslySetInnerHTML={{ __html: body }}></div>
                            <Widgets site={site} config={config} helper={helper} page={page} position={'left'} />
                            <Widgets site={site} config={config} helper={helper} page={page} position={'right'} />
                        </div>
                    </div>
                </section>
                <Footer config={config} helper={helper} />
                <Scripts site={site} config={config} helper={helper} page={page} />
                <Search config={config} helper={helper} />
            </body>
        </html>;
    }
};
