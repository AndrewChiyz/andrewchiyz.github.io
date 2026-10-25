# One editable paper record creates both language routes at build time.
module AcademicMigration
  class PaperPages < Jekyll::Generator
    priority :normal

    def generate(site)
      seen = {}
      site.collections.fetch('papers').docs.each do |paper|
        data = paper.data
        id = data.fetch('paper_id')
        url = data.fetch('detail_url')
        unless url.match?(%r{\A/publication/[a-zA-Z0-9_-]+\z})
          raise "Invalid paper URL: #{url}"
        end
        raise "Duplicate paper ID or URL: #{id}" if seen[id] || seen[url]
        seen[id] = seen[url] = true
        data['has_abstract'] = !paper.content.strip.empty?
        %w[en zh].each do |lang|
          route = (lang == 'zh' ? '/zh' : '') + url
          page = Jekyll::PageWithoutAFile.new(site, site.source, route.delete_prefix('/'), 'index.html')
          page.content = ''
          page.data = {
            'layout' => 'paper', 'section' => 'publications', 'lang' => lang,
            'paper_id' => id, 'title' => data.fetch('title'),
            'permalink' => route + '/', 'canonical_url' => route,
            'english_url' => url, 'chinese_url' => '/zh' + url
          }
          site.pages << page
        end
      end
    end
  end
end
