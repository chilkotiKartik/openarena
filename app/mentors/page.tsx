import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, MapPin, Star, Users, Briefcase, MessageSquare } from "lucide-react"

// Mock data for mentors
const mentors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Senior Software Engineer",
    company: "Google",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4.9,
    reviews: 127,
    students: 342,
    experience: "10+ years",
    location: "San Francisco, CA",
    availability: "Evenings & Weekends",
    specialties: ["Machine Learning", "Python", "System Design", "Career Guidance"],
    bio: "Former Google Tech Lead with expertise in scalable systems and machine learning. I've mentored over 300 students and professionals transitioning into tech roles.",
    achievements: ["Google Excellence Award", "Published Author", "Conference Speaker"],
    languages: ["English", "Spanish"],
    featured: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Full Stack Developer",
    company: "Microsoft",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4.7,
    reviews: 89,
    students: 215,
    experience: "8 years",
    location: "Seattle, WA",
    availability: "Weekends",
    specialties: ["React", "Node.js", "TypeScript", "Interview Prep"],
    bio: "Microsoft engineer specializing in web technologies. I focus on practical, hands-on mentoring to help you build real-world projects and prepare for technical interviews.",
    achievements: ["Open Source Contributor", "Tech Blog Author"],
    languages: ["English", "Mandarin"],
    featured: false,
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Product Manager",
    company: "Amazon",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4.8,
    reviews: 103,
    students: 278,
    experience: "7 years",
    location: "New York, NY",
    availability: "Flexible",
    specialties: ["Product Strategy", "Agile", "UX Design", "Career Transitions"],
    bio: "Product leader with experience at Amazon and startups. I help engineers understand the product side of tech and prepare for PM roles or better collaboration with product teams.",
    achievements: ["PM of the Year", "MBA Mentor"],
    languages: ["English", "Hindi"],
    featured: true,
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Security Engineer",
    company: "Netflix",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4.6,
    reviews: 76,
    students: 189,
    experience: "12 years",
    location: "Los Angeles, CA",
    availability: "Evenings",
    specialties: ["Cybersecurity", "Ethical Hacking", "Security Architecture", "Compliance"],
    bio: "Cybersecurity expert focused on helping developers build secure applications. I provide practical guidance on identifying and mitigating security vulnerabilities.",
    achievements: ["CISSP Certification", "Security Conference Speaker"],
    languages: ["English"],
    featured: false,
  },
  {
    id: 5,
    name: "Elena Rodriguez",
    role: "Data Scientist",
    company: "Spotify",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4.9,
    reviews: 92,
    students: 231,
    experience: "6 years",
    location: "Remote",
    availability: "Weekdays",
    specialties: ["Data Analysis", "Python", "ML Models", "Data Visualization"],
    bio: "Data scientist passionate about helping others break into the field. I provide guidance on portfolio projects, interview preparation, and practical data science skills.",
    achievements: ["PhD in Computer Science", "Published Researcher"],
    languages: ["English", "Spanish", "Portuguese"],
    featured: true,
  },
  {
    id: 6,
    name: "David Kim",
    role: "Mobile Developer",
    company: "Airbnb",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4.7,
    reviews: 84,
    students: 197,
    experience: "9 years",
    location: "Chicago, IL",
    availability: "Weekends",
    specialties: ["iOS Development", "Android", "React Native", "Mobile UX"],
    bio: "Mobile developer with experience across native and cross-platform frameworks. I help developers build beautiful, performant mobile applications.",
    achievements: ["App Store Featured App", "Mobile Development Instructor"],
    languages: ["English", "Korean"],
    featured: false,
  },
]

export default function MentorsPage() {
  return (
    <div className="container mx-auto py-8 px-4 animate-fadeIn">
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Find Your Mentor</h1>
          <p className="text-muted-foreground max-w-3xl">
            Connect with experienced industry professionals who can guide your learning journey, provide career advice,
            and help you develop the skills you need to succeed.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all">All Mentors</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="tech">Technical</TabsTrigger>
              <TabsTrigger value="career">Career</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Sort by: Rating
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="featured" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors
                .filter((m) => m.featured)
                .map((mentor) => (
                  <MentorCard key={mentor.id} mentor={mentor} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="tech" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors
                .filter((m) =>
                  m.specialties.some((s) =>
                    [
                      "Python",
                      "React",
                      "Node.js",
                      "TypeScript",
                      "Machine Learning",
                      "Cybersecurity",
                      "Data Analysis",
                      "iOS Development",
                      "Android",
                    ].includes(s),
                  ),
                )
                .map((mentor) => (
                  <MentorCard key={mentor.id} mentor={mentor} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="career" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors
                .filter((m) =>
                  m.specialties.some((s) => ["Career Guidance", "Interview Prep", "Career Transitions"].includes(s)),
                )
                .map((mentor) => (
                  <MentorCard key={mentor.id} mentor={mentor} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function MentorCard({ mentor }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <Avatar className="h-12 w-12 border-2 border-primary">
              <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
              <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{mentor.name}</CardTitle>
              <CardDescription className="flex flex-col">
                <span>{mentor.role}</span>
                <span className="text-sm text-muted-foreground">{mentor.company}</span>
              </CardDescription>
            </div>
          </div>
          {mentor.featured && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2 space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-medium">{mentor.rating}</span>
          </div>
          <span className="text-muted-foreground">({mentor.reviews} reviews)</span>
          <span className="text-muted-foreground">•</span>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{mentor.students} students</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span>{mentor.experience} experience</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{mentor.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Available: {mentor.availability}</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Specialties</h4>
          <div className="flex flex-wrap gap-2">
            {mentor.specialties.map((specialty, index) => (
              <Badge key={index} variant="outline" className="bg-background">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4">
        <Button variant="outline" size="sm" className="w-1/2">
          View Profile
        </Button>
        <Button size="sm" className="w-1/2">
          <MessageSquare className="h-4 w-4 mr-2" />
          Connect
        </Button>
      </CardFooter>
    </Card>
  )
}
