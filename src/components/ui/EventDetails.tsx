import { Calendar, MapPin, Clock, Phone, Mail, ExternalLink, Users } from 'lucide-react';
import type { Post } from '@/types/directus-schema';

interface EventDetailsProps {
  post: Post;
}

const EventDetails = ({ post }: EventDetailsProps) => {
  if (!post.is_event) return null;

  // Format date and time
  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return null;
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      dateOnly: date.toDateString()
    };
  };

  const startDateTime = formatDateTime(post.event_start_datetime);
  const endDateTime = formatDateTime(post.event_end_datetime);
  
  // Check if it's a multi-day event
  const isMultiDay = startDateTime && endDateTime && 
    startDateTime.dateOnly !== endDateTime.dateOnly;

  // Build venue address
  const venueParts = [
    post.venue_street,
    post.venue_city,
    post.venue_state,
    post.venue_postcode
  ].filter(Boolean);
  const venueAddress = venueParts.join(', ');

  // Google Maps embed URL
  const mapsEmbedUrl = venueAddress 
    ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyCiJuTLSLT--3qEWbcm-Q6ush-DsoFTr-E&q=${encodeURIComponent(venueAddress)}`
    : null;

  return (
    <div className="event-details space-y-8">
      {/* Event Header - Date and Time */}
      {startDateTime && (
        <div className="bg-background-muted p-6 rounded-lg border-l-4 border-accent">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-foreground">
              {post.event_name || post.title}
            </h2>
          </div>
          
          {isMultiDay ? (
            /* Multi-day event display */
            <div className="space-y-3">
              {/* Start Date and Time */}
              <div className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-accent" />
                <span className="font-medium">Start:</span>
                <span className="font-medium">
                  {startDateTime.date}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-lg ml-7">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>
                  {startDateTime.time}
                </span>
              </div>
              
              {/* End Date and Time */}
              <div className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-accent" />
                <span className="font-medium">End:</span>
                <span className="font-medium">
                  {endDateTime.date}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-lg ml-7">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>
                  {endDateTime.time}
                </span>
              </div>
            </div>
          ) : (
            /* Same-day event display */
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-accent" />
                <span className="font-medium">
                  {startDateTime.date}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>
                  {startDateTime.time}
                  {endDateTime && endDateTime.time !== startDateTime.time && (
                    <span> - {endDateTime.time}</span>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Event Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        {/* Left Column - Event Details */}
        <div className="space-y-6">
          {/* Event Information */}
          <div className="bg-background-muted p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Event Details
            </h3>
            
            {post.event_info && (
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {post.event_info}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              {post.ticket_url && (
                <a
                  href={post.ticket_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Buy Tickets
                </a>
              )}
              
              {post.more_info_url && (
                <a
                  href={post.more_info_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-accent text-accent px-4 py-2 rounded-lg hover:bg-accent hover:text-white transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  More Info
                </a>
              )}
            </div>
          </div>

          {/* Contact Information */}
          {(post.contact_phone || post.contact_email) && (
            <div className="bg-background-muted p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-accent" />
                Contact Information
              </h3>
              
              <div className="space-y-3">
                {post.contact_phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`tel:${post.contact_phone}`}
                      className="text-accent hover:underline"
                    >
                      {post.contact_phone}
                    </a>
                  </div>
                )}
                
                {post.contact_email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`mailto:${post.contact_email}`}
                      className="text-accent hover:underline"
                    >
                      {post.contact_email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Venue Location */}
        <div className="space-y-6">
          {/* Venue Information */}
          {venueAddress && (
            <div className="bg-background-muted p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" />
                Venue Location
              </h3>
              
              <div className="space-y-4">
                <div className="text-foreground">
                  {venueAddress}
                </div>
                
                {/* Map Embed */}
                {mapsEmbedUrl && (
                  <div className="mt-4">
                    <iframe
                      src={mapsEmbedUrl}
                      width="100%"
                      height="250"
                      style={{ border: 0, borderRadius: '8px' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Event Location Map"
                    />
                  </div>
                )}
                
                {/* Directions Link */}
                <div className="pt-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venueAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-accent hover:underline"
                  >
                    <MapPin className="h-4 w-4" />
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
