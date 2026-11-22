module AcademicMigration
  class MemberValidation < Jekyll::Generator
    priority :high
    def generate(site)
      site.collections.fetch('members').docs.each do |member|
        d=member.data
        raise "Member visible must be true/false: #{member.path}" unless [true,false].include?(d['visible'])
        next unless d['visible']
        topics=d.fetch('topics', [])
        allowed=site.data.fetch('member_topics').keys
        raise "Invalid member topics: #{member.path}" unless topics.is_a?(Array) && topics.all? { |topic| allowed.include?(topic) } && topics.uniq == topics
        raise "Invalid member status: #{member.path}" unless %w[current alumni].include?(d['status'])
        raise "Invalid member degree: #{member.path}" unless %w[phd master undergraduate].include?(d['degree'])
        raise "Member order must be an integer: #{member.path}" unless d['order'].is_a?(Integer)
        %w[year graduation_year].each do |field|
          value=d[field]
          raise "Invalid #{field}: #{member.path}" unless value.nil? || (value.is_a?(Integer) && (1900..2100).cover?(value))
        end
        %w[zh en].each do |lang|
          raise "Missing #{lang} member name: #{member.path}" unless d[lang].is_a?(Hash) && %w[name].all? { |key| d[lang][key].is_a?(String) && !d[lang][key].strip.empty? }
        end
        url=d['website'].to_s
        raise "Member homepage must use HTTPS: #{member.path}" unless url.empty? || url.match?(%r{\Ahttps://[^\s]+\z})
        photo=d['photo'].to_s
        unless photo.empty?
          raise "Use a photo under /images/members/: #{member.path}" unless photo.match?(%r{\A/images/members/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)\z})
          root=File.expand_path('../..',site.source)
          raise "Missing member photo #{photo}" unless File.file?(File.join(root,photo.delete_prefix('/')))
        end
      end
    end
  end
end
