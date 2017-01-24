<div class="panel">    
	   
	    <div class="inner">
	      	<div class="user_card">
	  			<div>
	  				
	    			<a class="user_avatar" href="/users/ucenter">
	    			<% if(user.uportrait){ %>
	    				<img src="/uportrait/<%= user.uportrait %>">
	    			<% }else{ %>

	      				<img src="/uportrait/default.png">
	    			<%} %>
	  				</a>
				    <span class="user_name">
				    	<a class="dark" href="/users/ucenter"><%= user.uname %></a>
				    </span>

				    <div class="board">
				      <div class="floor">
				        <span class="big">积分: <%= user.gold %> </span>
				      </div>
				    </div>
	    			<div class="space clearfix"></div>
				    <span class="signature">
				        “
				        	
				            <%= user.des ||'这个家伙很懒，什么都没有留下....' %>
				        
				        ”
				    </span>
	 			</div>
			</div>
		</div>    
 	</div>