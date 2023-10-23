import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import credentials from 'credentials.json'; // Adjust the path to your JSON file
import intoStream from 'into-stream';

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, message: 'No file provided' });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Convert the Buffer to a Readable stream
  const bufferStream = intoStream(buffer);

  try {
    // Authenticate with OAuth 2.0
    const oauth2Client = new google.auth.OAuth2(
      credentials.web.client_id,
      credentials.web.client_secret,
      credentials.web.redirect_uris[0]
    );

    // Here, you would typically get the tokens from your database and set them
    oauth2Client.setCredentials({
      access_token: 'ya29.a0AfB_byD4p7OI84P1aSFhaHu_8kMMvV-E7lUj3RxIzDnY7QGtyxZCkrXEpV-ugBHDcB732VFNUYyYhdBE3q7QmncPCijkU2rq1pkiAHiBvYt5IwtCK66I_Is6h-k8l_8Qlcn-dRvGYIhEriH1mKzbPF14tFfgNq5EErSVaCgYKAUgSARISFQGOcNnCAFLQuQGb36ZTAIzzxRthpA0171',
      refresh_token: '1//05kcyOa8NfwOJCgYIARAAGAUSNwF-L9Ir9lr2OtXN1ia80_yRso_KlPGN52vZQT0pF__5xV3WAN475OjAWyYvHZ-eKhDKuqokZG0'
    });

    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client
    });

    // Upload the video
    const response = await youtube.videos.insert(
      {
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: 'Your Video Title',
            description: 'Your Video Description',
            tags: ['tag1', 'tag2'],
            categoryId: '22' // "People & Blogs" category, change as needed
          },
          status: {
            privacyStatus: 'private' // or 'public' or 'unlisted'
          },
        },
        media: {
          body: bufferStream
        }
      }
    );

    console.log(`Video uploaded with ID: ${response.data.id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json({ success: false, message: 'Error uploading video' });
  }
}
