require 'yaml'
root='migration/jekyll'
courses={}
Dir[root+'/_data/courses/*.yml'].each do |file|
  course=YAML.load_file(file)
  id=File.basename(file,'.yml')
  raise "Course ID mismatch: #{file}" unless course['slug']==id
  raise "Missing poster: #{id}" unless File.file?('.'+course.fetch('poster').fetch('src'))
  %w[en zh].each do |lang|
    raise "Missing title: #{id}/#{lang}" if course.fetch(lang).fetch('title').empty?
    md=File.read(root+"/_courses/#{id}/#{lang}.md")
    front=YAML.safe_load(md.split(/^---\s*$\n?/,3)[1])
    url=(lang=='zh' ? '/zh' : '')+course.fetch('url')
    raise "Course metadata mismatch: #{id}/#{lang}" unless front['permalink']==url+'/' && front['canonical_url']==url && front['course_id']==id && front['lang']==lang
  end
  courses[id]=course
end
years=YAML.load_file(root+'/_data/teaching_years.yml')
raise 'Duplicate academic years' unless years.map { |y| y['year'] }.uniq.length==years.length
years.each { |y| y.fetch('courses').each { |c| raise "Unknown course: #{c['id']}" unless courses.key?(c['id']) } }
puts "PASS: #{courses.length} course records, bilingual Markdown, posters, and #{years.length} academic years."
papers=Dir[root+'/_papers/*.md'].map do |file|
  data=YAML.safe_load(File.read(file).split(/^---\s*$\n?/,3)[1])
  %w[paper_id title authors venue type short citation detail_url].each do |key|
    raise "Missing #{key}: #{file}" unless data[key].is_a?(String) && !data[key].empty?
  end
  raise "Invalid paper type: #{file}" unless %w[journal conference].include?(data['type'])
  raise "Invalid paper ordering: #{file}" unless data['order'].is_a?(Integer)
  raise "Invalid year: #{file}" unless data['year'].is_a?(Integer)
  raise "Invalid paper URL: #{file}" unless data['detail_url'].match?(%r{\A/publication/[a-zA-Z0-9_-]+\z})
  data
end
%w[paper_id detail_url order].each { |key| raise "Duplicate paper #{key}" unless papers.map { |p| p[key] }.uniq.length==papers.length }
puts "PASS: #{papers.length} independent paper records and unique IDs, ordering and URLs."
